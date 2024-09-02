document
  .getElementById("generate-button")
  .addEventListener("click", generatePixelArt);

document
  .getElementById("download-button")
  .addEventListener("click", downloadImage);

document
  .getElementById("image-upload")
  .addEventListener("change", function (event) {
    const hasImage = event.target.files.length > 0;
    document.getElementById("generate-button").disabled = !hasImage;
  });

document.getElementById("range").addEventListener("input", function (event) {
  const pixelSize = event.target.value;
  document.getElementById("pixel-size").textContent = pixelSize;
});

function resizeImageProportionally(img, maxWidth, maxHeight) {
  const originalWidth = img.width;
  const originalHeight = img.height;

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  // Calculate aspect ratio
  const aspectRatio = originalWidth / originalHeight;

  // Resize based on the maximum width
  if (originalWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = newWidth / aspectRatio;
  }

  // Resize based on the maximum height
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }

  return { width: newWidth, height: newHeight };
}

function generatePixelArt() {
  document.getElementById("download-button").disabled = false;

  const fileInput = document.getElementById("image-upload");
  const canvas = document.getElementById("pixel-art-canvas");
  const ctx = canvas.getContext("2d");

  if (fileInput.files && fileInput.files[0]) {
    const img = new Image();
    img.onload = function () {
      const maxWidth = 100; // Desired maximum width
      const maxHeight = 100; // Desired maximum height
      const pixelSize = 10; // Size of each "pixel" in the final output

      // Resize image proportionally
      const { width, height } = resizeImageProportionally(
        img,
        maxWidth,
        maxHeight,
      );

      // Set the canvas size to accommodate the pixel size
      canvas.width = width * pixelSize;
      canvas.height = height * pixelSize;

      // Draw the resized image on the canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Get the image data from the canvas
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Clear the canvas to draw the pixel art
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Loop through each pixel in the image data
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3] / 255;

          // Set the fill style to the pixel's color
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

          // Draw the "pixel" as a rectangle on the canvas
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    };

    img.onerror = function (e) {
      console.error("Error loading image:", e);
    };

    img.src = URL.createObjectURL(fileInput.files[0]);
  }
}

function downloadImage() {
  const canvas = document.getElementById("pixel-art-canvas");
  const link = document.createElement("a");

  // Create a data URL from the canvas content
  link.href = canvas.toDataURL("image/png");

  // Set the download attribute with a filename
  link.download = "pixel-art.png";

  // Trigger a click on the link to start the download
  link.click();
}
