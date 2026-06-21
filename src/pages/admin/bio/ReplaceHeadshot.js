import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase";


export async function ReplaceHeadshot(uid, oldHeadshot, newFile) {

  if(!newFile) return oldHeadshot;

  const croppedFile = await CropAndResize(newFile, 500);

  const extension = newFile.name.split('.').pop().toLowerCase();
  const newStoragePath = `headshots/${uid}.${extension}`;
  const newImageRef = ref(storage, newStoragePath);

  if(oldHeadshot.storage) await deleteObject(ref(storage, oldHeadshot.storage));

  await uploadBytes(newImageRef, croppedFile);

  const newUrl = await getDownloadURL(newImageRef);

  return {
    url: newUrl,
    storage: newStoragePath
  }

}


async function CropAndResize(file, maxSize=750) {

  const image = new Image();
  image.src = URL.createObjectURL(file);

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const size = Math.min(image.width, image.height);
  const sourceX = (image.width - size) / 2;
  const sourceY = (image.height - size) / 2;

  const outputSize = Math.min(size, maxSize);

  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    size,
    size,
    0,
    0,
    outputSize,
    outputSize
  );

  URL.revokeObjectURL(image.src);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(
          new File([blob], file.name, {
            type: file.type,
          })
        );
      },
      file.type,
      0.9
    )
  })

}