import { IMAGE_MAX } from '../config.js';

export const getImageSize = (width, height) => {
  const xL = (width / 8) % 256;
  const xH = (width / 8) / 256;
  const yL = height % 256;
  const yH = height / 256;
  const k = (xL + 256 * xH) * (yL + 256 * yH);
  return { xL, xH, yL, yH, k };
};

/**
 * Calculate max line height for target height
 * @param Number width
 * @param Number height
 * @returns Number
 */
const calculateChunkSize = (width, height) => {
  const { k } = getImageSize(width, 1);
  const chunkHeight = IMAGE_MAX / k;
  return Math.ceil(height / chunkHeight);
};

/**
 * Split Canvas in ImageData chunks.
 * @param Canvas canvas
 * @param Number width
 * @returns Array
 */
export const splitCanvasInImageDataChunks = (canvas) => {
  const ctx = canvas.getContext('2d');

  const count = calculateChunkSize(canvas.width, canvas.height);
  const chunks = [];
  for (let i = 0; i < count; i++) {
    chunks.push(ctx.getImageData(0, (canvas.height / count) * i, canvas.width, canvas.height / count));
  }
  return chunks;
};

function imageDataToPixelArray (imageData) {
  const getPixel = (x, y) => {
    const i = (y * imageData.width + x) * 4;
    const data = imageData.data;
    return {
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
      a: data[i + 3]
    };
  };
  const pixels = [];
  for (let y = 0; y < imageData.height; y++) {
    pixels[y] = pixels[y] || [];
    for (let x = 0; x < imageData.width; x++) {
      pixels[y][x] = getPixel(x, y);
    }
  }
  return pixels;
}
/**
 * Get 8 bit rows from ImageData.
 * @param ImageData imageData
 * @returns Array
 */
export const get8BitRowsFromImageData = (imageData) => {
  const lines = [];
  const { width, height } = imageData;
  const pixels = imageDataToPixelArray(imageData);

  for (let y = 0; y < height; y++) {
    lines[y] = new Uint8Array(width / 8);
    for (let x = 0; x < lines[y].length; x++) {
      lines[y][x] = 0;
      for (let n = 0; n < 8; n++) {
        const { r, g, b, a } = pixels[y][(x * 8 + n)];
        const brightness = ((r + g + b) / 3) / 255;
        // only print dark stuff
        if (brightness < 0.6 || a < 0.6) {
          lines[y][x] |= (1 << 7 - n);
        }
      }
    }
  }
  return lines;
};
