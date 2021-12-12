
import canvas from 'canvas';
const { createCanvas } = canvas;

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
