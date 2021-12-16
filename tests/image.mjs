
import { createPrinter } from '../index.js';
import { ALIGN } from '../utils/config.js';

const printer = createPrinter();

async function run () {
  printer.setAlign(ALIGN.CENTER);
  // await printer.writeCanvas(getCuby(100));
  // // printer.feedPitchByFont(4);
  // await printer.writeImage('img/devterm.jpeg');
  // printer.feedPitchByFont(4);
  // await printer.writeBarcode('node-devterm');
  // printer.feedPitchByFont(4);
  // await printer.writeQRCode('https://github.com/ThornWalli/node-devterm', null);

  printer.feedPitchByFont(20);
}

run();
