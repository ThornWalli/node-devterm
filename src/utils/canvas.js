
import fs from 'fs';
import canvas from 'canvas';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import floydSteinberg from 'floyd-steinberg';

import { MAX_DOTS } from 'devterm/config';

const { createCanvas, loadImage, Canvas } = canvas;

export { createCanvas, Canvas };

export const prepareCanvasForPrint = (canvas, options) => {
  options = { width: null, rotate: false, flipX: false, flipY: false, grayscale: false, ...options };

  if (options.rotate) {
    canvas = rotateCanvas90Deg(canvas);
  }

  if (options.flipX || options.flipY) {
    canvas = flipCanvas(canvas, options.flipX, options.flipY);
  }

  canvas = resizeCanvas(canvas, options.width);

  if (options.grayscale) {
    canvas = useFloydSteinberg(canvas);
  }

  return canvas;
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
 * @param String|Buffer path
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
export const resizeCanvas = (canvas, width) => {
  width = Math.min(canvas.width, Math.min((width || canvas.width), MAX_DOTS));
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
  return fs.promises.writeFile(path, pngData);
};

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
