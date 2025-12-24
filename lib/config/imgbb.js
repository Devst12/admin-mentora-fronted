// lib/config/imgbb.js
export const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

// Use web worker for compression
export function compressImage(imageFile, quality = 0.6) {
  return new Promise((resolve, reject) => {
    console.log("Main thread: Starting worker for", imageFile.name);
    const worker = new Worker("/workers/imageCompressor.js");

    worker.postMessage({ file: imageFile, quality });

    worker.onmessage = (e) => {
      const { success, file, error, originalSize, compressedSize } = e.data;
      if (!success) {
        console.error("Main thread: Worker failed:", error);
        reject(new Error(error));
      } else {
        console.log("Main thread: Worker success. Ratio:", ((compressedSize / originalSize) * 100).toFixed(2) + "%");
        resolve(file);
      }
      worker.terminate();
    };

    worker.onerror = (err) => {
      console.error("Main thread: Worker load/error:", err);
      reject(new Error("Worker failed to load or run"));
      worker.terminate();
    };

    // Timeout to prevent hanging (30 seconds)
    setTimeout(() => {
      reject(new Error("Compression timed out"));
      worker.terminate();
    }, 30000);
  });
}

export async function uploadImageToImgBB(imageFile, compressionQuality = 0.6) {
  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key is not configured");
  }

  let fileToUpload = imageFile;
  if (imageFile.type?.startsWith("image/")) {
    console.log("Attempting compression with worker...");
    try {
      fileToUpload = await compressImage(imageFile, compressionQuality);
      console.log("Compression done! Uploading compressed file.");
    } catch (err) {
      console.warn("Compression failed, uploading original:", err.message);
      // Fallback to original
    }
  }

  const formData = new FormData();
  formData.append("image", fileToUpload);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message);
    return data.data.url;
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    throw error;
  }
}