
import { promises } from 'fs';
import canvas from 'canvas';
import QRCode from 'qrcode';
import { IMAGE_MAX, MAX_DOTS } from './config.js';
import JsBarcode from 'jsbarcode';

import floydSteinberg from 'floyd-steinberg';

const { createCanvas, loadImage } = canvas;

export const useFloydSteinberg = (canvas) => {
  const ctx = canvas.getContext('2d');
  ctx.putImageData(floydSteinberg(ctx.getImageData(0, 0, canvas.width, canvas.height)), 0, 0);
  return canvas;
};

/**
 * Get Canvas from Barcode.
 * @param String text
 * @param Number width
 * @param Object options https://github.com/lindell/JsBarcode/wiki/Options
 * @returns Canvas
 */
export const getBarcode = (text, options) => {
  const canvas = createCanvas();
  try {
    JsBarcode(canvas, text, options);
    return canvas;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get Canvas from QRCode.
 * @param String text
 * @param Number width
 * @param Object options https://github.com/soldair/node-qrcode#qr-code-options
 * @returns Canvas
 */
export async function getQRCode (text, options = {}) {
  options = {
    margin: 0,
    ...options
  };
  const canvas = createCanvas(options.width, options.width);
  return new Promise(resolve => {
    QRCode.toCanvas(canvas, text, options, (err) => {
      if (err) {
        throw err;
      }
      resolve(canvas);
    });
  });
}

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
export const splitCanvasInImageDataChunks = (canvas, width) => {
  canvas = resizeCanvas(canvas, width);
  canvas = useFloydSteinberg(canvas);
  const ctx = canvas.getContext('2d');

  // const { k } = getImageSize(canvas.width, canvas.height);
  // const count = k / (IMAGE_MAX / 2);

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
export const getBitRowsFromImageData = (imageData) => {
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
        // const { r, g, b, a } = pixels[y][(width - 1) - (x * 8 + n)];
        // const brightness = ((r + g + b) / 3) / 255;
        // // only print dark stuff
        // if (brightness < 0.6 || a < 0.6) {
        //   lines[y][x] += (1 << n);
        // }
      }
    }
  }
  // bit reverse
  // lines.forEach(line => line.reverse());
  return lines;
};

/**
 * Get ImageData from Canvas.
 * @param Canvas canvas
 * @returns
 */
export const canvasToImageData = (canvas) => {
  const ctx = canvas.getContext('2d');
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

/**
 * Get Canvas from image file.
 * @param String path
 * @param Number width
 * @returns Canvas
 */
export const getCanvasFromImage = async (path) => {
  const img = await loadImage(path);
  const canvas = createCanvas(img.width, img.height);
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  return canvas;
};

/**
 * Resize Canvas.
 * @param Canvas canvas
 * @param Number width
 * @returns Canvas
 */
const resizeCanvas = (canvas, width) => {
  width = Math.min(canvas.width, Math.min((width || canvas.width), MAX_DOTS));
  width += (width % 8) >= 3 ? (width % 8) : -(width % 8); // fix width for divide by 8
  const height = width * (canvas.height / canvas.width);

  const resizedCanvas = createCanvas(width, height);
  resizedCanvas.getContext('2d').drawImage(canvas, 0, 0, width, height);
  return resizedCanvas;
};

export const cloneCanvas = (canvas) => {
  const clone = createCanvas(canvas.width, canvas.height);
  const ctx = clone.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
  return clone;
};

export const flipCanvas = (canvas, horizontal, vertical) => {
  const mirrorCanvas = createCanvas(canvas.width, canvas.height);
  const ctx = mirrorCanvas.getContext('2d');
  console.log(1 - horizontal * 2, 1 - vertical * 2);
  const x = 1 - horizontal * 2;
  const y = 1 - vertical * 2;
  ctx.translate(horizontal * canvas.width, vertical * canvas.height);
  ctx.scale(x, y);
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
  return mirrorCanvas;
};

export const rotateCanvas90Deg = (canvas) => {
  let ctx = canvas.getContext('2d');
  const rotatedCanvas = createCanvas(canvas.height, canvas.width);
  ctx = rotatedCanvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.height, canvas.width);
  ctx.translate(canvas.height, 0);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(canvas, 0, 0);
  return rotatedCanvas;
};

export const saveCanvasAsPng = async (canvas, path) => {
  const pngData = await canvas.toBuffer('image/png');
  return promises.writeFile(path, pngData);
};
