import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db, storage } from "../../../firebase";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Uid10 } from "../../../components/uid-10/Uid10";
import { ResizeImage } from "../../../components/admin-resize-image/ResizeImage";


export async function handleShowSave(s, pastShowImages, whatsOnImages, showPageImages, setSaving, setSaveProgress, navigate) {

  const valid = await checkValidity(s, pastShowImages, whatsOnImages);
  if(!valid) return;

  // Prep for save
  setSaveProgress(0);
  setSaving(true);
  const initialUid = window.location.pathname.split('/').pop();
  const updatedShow = structuredClone(s);

  try {
    let completedOperations = 0;
    const totalOperations = getPendingUploads(pastShowImages, whatsOnImages, showPageImages);

    const updateProgress = () => {
      completedOperations += 1;
      setSaveProgress(
        totalOperations 
        ? Math.round((completedOperations / totalOperations) * 90)
        : 90
      );
    }

    // PAST SHOW THUMBNAIL
    if(pastShowImages.thumbnail.file) {
      const file = pastShowImages.thumbnail.file;
      const oldStorage = s.past_show.thumbnail.storage;
      const uploaded = await resizeAndUploadImage(file, 900, `shows/listings/past-show/${Uid10()}.${extensionFromFile(file)}`)
      if(oldStorage) await safeDelete(oldStorage);
      updatedShow.past_show.thumbnail = uploaded;
      updateProgress();
    }

    // WHATS ON IMAGES
    const whatsOnDimensions = {
      large: {width: 1600, quality: 1},
      medium: {width: 1200, quality: 0.95},
      small: {width: 800, quality: 0.9}
    }

    for(const size of ['large', 'medium', 'small']) {
      const localImage = whatsOnImages[size];
      const savedImage = s.whats_on.photos[size];
      const maxWidth = whatsOnDimensions[size].width;
      const quality = whatsOnDimensions[size].quality;

      if(localImage.inherited) {
        if(savedImage.storage) await safeDelete(savedImage.storage);
        updatedShow.whats_on.photos[size] = {
          url: '',
          storage: ''
        };
        continue
      }

      if(localImage.file) {
        const file = localImage.file;
        const uploaded = await resizeAndUploadImage(file, maxWidth, `shows/listings/whats-on/${size}/${Uid10()}.${extensionFromFile(file)}`, quality)
        if(savedImage.storage) await safeDelete(savedImage.storage);
        updatedShow.whats_on.photos[size] = uploaded;
        updateProgress();
      }
      else if(!localImage.preview) {
        await safeDelete(savedImage.storage);
        updatedShow.whats_on.photos[size] = {
          url: '',
          storage: ''
        };
      }
    }

    // DELETED SHOW PAGE IMAGES
    for(const sectionImages of Object.values(showPageImages)) {
      if(sectionImages?.deleted && sectionImages.storage) {
        await safeDelete(sectionImages.storage);
        updateProgress();
      }

      for(const image of sectionImages?.images ?? []) {
        if(image.deleted && image.storage) {
          await safeDelete(image.storage);
          updateProgress();
        }
      }
    }

    // SHOW PAGE HEADERS AND GALLERIES
    updatedShow.show_page.content = await Promise.all(
      updatedShow.show_page.content.map(async section => {
        const localImages = showPageImages[section.uid];

        if(section.type === 'header') {
          if(!localImages?.file) return section;
          const file = localImages.file;
          const uploaded = await resizeAndUploadImage(file, 1600, `shows/show-pages/headers/${Uid10()}.${extensionFromFile(file)}`, 1);
          if(section.storage) await safeDelete(section.storage);
          updateProgress();

          return {
            ...section,
            url: uploaded.url,
            storage: uploaded.storage
          };
        }

        if(section.type === 'gallery') {
          const galleryImages = localImages?.images ?? [];

          const savedImages = await Promise.all(
            galleryImages
              .filter(image => !image.deleted)
              .map(async image => {

                if(!image.file) {
                  return {
                    uid: image.uid,
                    url: image.preview,
                    storage: image.storage,
                    caption: image.caption ? image.caption : ''
                  };
                }

                const uploaded = await resizeAndUploadImage(image.file, 1250, `shows/show-pages/galleries/${section.uid}/${image.uid}.${extensionFromFile(image.file)}`, 1);
                updateProgress();

                return {
                  uid: image.uid,
                  url: uploaded.url,
                  storage: uploaded.storage,
                  caption: image.caption
                };
              }
            )
          );

          return {
            ...section,
            images: savedImages
          };
        }

        return section;
      })
    );

    // GET SORTING INDEX
    const firstPerformance = (
      updatedShow.performances.length 
      ?  updatedShow.performances.reduce((earliest, p) => p.from < earliest.from ? p : earliest).from
      : '9999-99-99'
    )
    const lastPerformance = (
      updatedShow.performances.length 
      ? updatedShow.performances.reduce((latest, p) => p.to > latest.to ? p : latest).to 
      : '9999-99-99'
    )
    updatedShow.sorting_index = `${firstPerformance}-${lastPerformance}-${updatedShow.uid}`;

    // SAVE FIRESTORE DOC
    await setDoc(doc(db, 'shows', updatedShow.uid), updatedShow);
    setSaveProgress(100);

    if(initialUid !== updatedShow.uid) {
      await deleteDoc(doc(db, 'shows', initialUid));
      navigate(`/admin/shows/${updatedShow.uid}`, {replace: true});
    }
    else {
      window.location.reload();
    }
  }
  catch(err) {
    console.error(err);
    alert('An error occurred. Could not save.');
    setSaving(false);
  }

}





/*
*
*   HELPERS
* 
*/


async function checkValidity(s, pastShowImages, whatsOnImages) {

  function sendError(label) {
    alert(label);
    return false;
  }

  const initialUid = window.location.pathname.split('/').pop();


  /*
  *
  *   LISTING
  * 
  */
  if(s.uid !== initialUid) {
    const docRef = doc(db, 'shows', s.uid);
    const snap = await getDoc(docRef);
    if(snap.exists()) return sendError("A show with this UID already exists (see: Listing > UID)");
  }
  if(s.uid === 'new-show') return sendError("Your show must have a name before it can be saved (see: Listing > UID)")

  // If the show is private, the UID is the only thing we need to check
  if(!s.public) return true;

  if(s.currently_showing && !whatsOnImages.large.preview) return sendError("You must provide a large image for the show listing (see: Listing > Large)")
  else if(!s.currently_showing) {
    if(!pastShowImages.thumbnail.preview) return sendError("You must provide a thumbnail image for the show listing (see: Listing > Thumbnail)")
    if(!s.past_show.short_description.trim()) return sendError("You must provide a Short Description for the show listing (see: Listing > Short Description)")
    else if(s.past_show.short_description.trim().length > 120) return sendError("The Short Description in your listing must be 120 characters or fewer (see: Listing > Short Description)")
  }


  /*
  *
  *   CREDITS
  * 
  */
  for (const [i, c] of s.credits.entries()) {
    if(!c.most_recent && !c.label.trim().length) return sendError(`Any credits not marked as 'Most Recent' require a label (see: Credits > Item ${i+1})`)
  }
  

  /*
  *
  *   PERFORMANCES
  * 
  */
  for (const [i, p] of s.performances.entries()) {
    if(!p.venue.trim().length && !p.town.trim().length) return sendError(`All performances must have a provided venue and/or town (see: Performances > Item ${i+1})`)
    if(!p.from) return sendError(`All performances must have a first show date (see: Performances > Item ${i+1})`)
    if(!p.to) return sendError(`All performances must have a last show date (see: Performances > Item ${i+1})`)
  }

  return true;

}


export async function safeDelete(storagePath) {
  if(!storagePath) return;

  try {
    await deleteObject(ref(storage, storagePath));
  }
  catch(err) {
    if(err.code !== 'storage/object-not-found') throw err;
  }
}


function extensionFromFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension || 'jpg';
}


async function resizeAndUploadImage(file, maxWidth, storagePath, quality=0.9) {
  const imageRef = ref(storage, storagePath);

  const resizedFile = await ResizeImage(file, maxWidth, quality);
  await uploadBytes(imageRef, resizedFile, { contentType: resizedFile.type });

  return {
    url: await getDownloadURL(imageRef),
    storage: storagePath
  }
}


function getPendingUploads(pastShowImages, whatsOnImages, showPageImages) {
  return (
    (pastShowImages.thumbnail.file ? 1 : 0) + 
    Object.values(whatsOnImages).filter(image => image.file).length + 
    Object.values(showPageImages).reduce((total, section) => {
      if(section?.file) return total + 1;
      return total + (
        section?.images?.filter(image => image.file || image.deleted).length ?? 0
      );
    }, 0)
  )
}