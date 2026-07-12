import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { safeDelete } from "./handleShowSave";


export async function handleShowDelete(initialUid, setDeleting, setDeleteProgress, navigate) {

  setDeleting(true);
  setDeleteProgress(0);

  try {
    // Get the original show
    const docRef = doc(db, 'shows', initialUid);
    const snap = await getDoc(docRef);

    if(!snap.exists()) {
      alert('Show could not be found - has it already been deleted?');
      return;
    }

    const show = snap.data();

    let completedOperations = 0;
    const totalOperations = getTotalOperations(show);
    
    const updateProgress = () => {
      const progress = totalOperations ? Math.floor(completedOperations / totalOperations * 100) : 90;
      setDeleteProgress(progress);
    }

    // Delete past show
    if(show.past_show.thumbnail.storage) {
      await safeDelete(show.past_show.thumbnail.storage);
      updateProgress();
    }

    // Delete whats on images
    for(const size of ['large', 'medium', 'small']) {
      if(show.whats_on.photos[size].storage) {
        await safeDelete(show.whats_on.photos[size].storage);
        updateProgress();
      }
    }

    // Delete show images
    for(const section of show.show_page.content) {
      if(section.type === 'header' && section.storage) {
        await safeDelete(section.storage);
        updateProgress();
      }
      else if(section.type === 'gallery' && section.images.length) {
        for(const image of section.images) {
          await safeDelete(image.storage);
          updateProgress();
        }
      }
    }

    // Finally, Delete show 
    await deleteDoc(docRef);
    navigate('/admin/shows');
  }
  catch(err) {
    alert('Could not delete show. Please try again.');
    console.error(err);
    setDeleteProgress(0);
    setDeleting(false);
  }

}



function getTotalOperations(s) {
  let totalOperations = 0

  if(s.past_show.thumbnail.storage) totalOperations += 1;
  if(s.whats_on.photos.large.storage) totalOperations += 1;
  if(s.whats_on.photos.medium.storage) totalOperations += 1;
  if(s.whats_on.photos.small.storage) totalOperations += 1;

  s.show_page.content.forEach((section) => {
    if(section.type === 'header' && section.storage) totalOperations += 1;
    else if(section.type === 'gallery') totalOperations += section.images.length; 
  });

  return totalOperations;
}