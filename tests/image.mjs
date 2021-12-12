
import Printer from '../classes/Printer.js';
import { ALIGN, FONT, IMAGE_MAX, MAX_DOTS } from '../utils/config.js';
import canvas from 'canvas';
import { join, resolve } from 'path';
import { saveCanvasAsPng } from '../utils/image.js';

import { getCuby } from '../utils/stuff.js';
const { loadImage, createCanvas } = canvas;
const __dirname = resolve(); ;

const printer = new Printer();

const createTest = () => {
  const canvas = createCanvas(128, 256);
  const ctx = canvas.getContext('2d');
  const offset = 8;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.fillRect(offset / 2, offset / 2, canvas.width - offset, canvas.height - offset);
  return canvas;
};

async function run () {
  // const imageData = await getImageDataFromImage(resolve(__dirname, 'img/clockwork.jpeg'));

  // const imageData = await drawTest(370, 6);
  const commands = [
    () => printer.reset(),
    () => printer.feedPitchByPixel(20),
    () => printer.setAlign(ALIGN.CENTER),
    // () => printer.writeBarcode('A', 100),
    // () => printer.writeQRCode('https://lammpee.de', 96),
    // () => printer.writeBarcode('https://lammpee.de', 150),
    // () => printer.writeBarcode('https://lammpee.de', 150, { rotate: true, flipX: false }),
    // () => printer.writeImage('img/clockwork.jpeg', { width: 100 }),
    // () => printer.writeImage('img/clockwork.jpeg', { width: 100, rotate: true, flipX: false, flipY: false }),
    // () => printer.writeImage('img/clockwork.jpeg', { width: 100, flipX: true, flipY: false }),
    // () => printer.writeImage('img/clockwork.jpeg', { width: 100, flipX: true, flipY: true }),
    // () => printer.writeImage('img/clockwork.jpeg', { width: 100, flipX: false, flipY: true }),
    // () => printer.writeCanvas(createTest()),
    // async () => printer.writeCanvas(await getCuby(132 / 11), { rotate: true, flipX: false }),
    // () => printer.writeQRCode('https://lammpee.de', null, { width: 164 }),
    // () => printer.writeQRCode('https://lammpee.de', null, { width: 128, rotate: true }),
    () => printer.feedPitchByPixel(20),
    // () => printer.writeQRCode('https://lammpee.de', 16, { scale: 1 })/,
    // () => printer.writeQRCode('https://lammpee.de', 32),
    // () => printer.writeQRCode('https://lammpee.de', 48),
    // () => printer.writeQRCode('https://lammpee.de', 64),
    // () => printer.writeQRCode('https://lammpee.de', 96),
    // () => printer.writeCanvas(imageData, 96),
    // () =>
    //   getImageDataChunks(canvas, IMAGE_MAX)
    //     .reduce((result, command) => result.then(() => printer.writeCanvas(command)), Promise.resolve()),
    // async () => printer.writeCanvas(await drawQRCode('https://lammpee.de', 128)),
    // async () => printer.writeCanvas(await drawQRCode('https://lammpee.de', 128)),
    // () => printer.setAlign(ALIGN.LEFT),
    // () => printer.setFont(FONT.SIZE_8_16_1),
    // () => printer.writeLine('test'),
    // () => printer.setAlign(ALIGN.RIGHT),
    // () => printer.setFont(FONT.SIZE_8_16_2),
    () => printer.writeLine('test'),
    () => printer.feedPitchByFont(20),
    () => printer.addCutline()
  ];

  await commands.reduce((result, command) => result.then(command), Promise.resolve());
}

run();
