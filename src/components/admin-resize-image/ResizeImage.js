export async function ResizeImage(file, maxWidth, quality = 0.9) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;

      console.log("ResizeImage input:", {
        fileName: file.name,
        originalWidth,
        originalHeight,
        maxWidth,
        quality,
      });

      if (originalWidth <= maxWidth) {
        console.log("ResizeImage unchanged:", {
          width: originalWidth,
          height: originalHeight,
        });

        URL.revokeObjectURL(objectUrl);
        resolve(file);
        return;
      }

      const scale = maxWidth / originalWidth;
      const newWidth = Math.round(originalWidth * scale);
      const newHeight = Math.round(originalHeight * scale);

      console.log("ResizeImage output:", {
        newWidth,
        newHeight,
        scale,
      });

      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not create canvas context."));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        blob => {
          URL.revokeObjectURL(objectUrl);

          if (!blob) {
            reject(new Error("Failed to resize image."));
            return;
          }

          const resizedFile = new File([blob], file.name, {
            type: blob.type,
            lastModified: file.lastModified,
          });

          console.log("ResizeImage completed:", {
            fileName: resizedFile.name,
            fileSize: resizedFile.size,
            type: resizedFile.type,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
          });

          resolve(resizedFile);
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image."));
    };

    img.src = objectUrl;
  });
}