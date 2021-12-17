
import canvas from 'canvas';
import { MAX_DOTS } from './config.js';
import { saveCanvasAsPng } from './image.js';
const { createCanvas } = canvas;

export const getTest = () => {
  const width = MAX_DOTS;
  const height = 20;
  const offset = 1;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.fillRect(offset, offset, width - offset * 2, height - offset * 2);

  // ctx.moveTo(0, 0);
  // ctx.lineTo(width, height);
  // ctx.moveTo(width, 0);
  // ctx.lineTo(0, height);
  // ctx.stroke();
  // ctx.fillRect(0, 0, 10, 2);
  // ctx.fillRect(0, 0, 2, 10);

  // const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  // // Add three color stops
  // gradient.addColorStop(0, '#fff');
  // gradient.addColorStop(1, '#000');

  // // Set the fill style and draw a rectangle
  // ctx.fillStyle = gradient;
  // ctx.fillRect(0, 0, width, height);
  saveCanvasAsPng(canvas, 'test.png');
  return canvas;
};

export const getCuby = (width) => {
  const scale = Math.round(width / 16);
  const canvas = createCanvas(16 * scale, 11 * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.scale(scale, scale);

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 5, 5);
  ctx.fillRect(11, 0, 5, 5);
  ctx.fillRect(0, 7, 16, 4);

  ctx.fillStyle = '#fff';
  ctx.fillRect(1, 1, 3, 3);
  ctx.fillRect(12, 1, 3, 3);
  ctx.fillRect(1, 8, 14, 2);

  ctx.fillStyle = '#000';
  ctx.fillRect(2, 2, 1, 1);
  ctx.fillRect(13, 2, 1, 1);

  return canvas;
};
