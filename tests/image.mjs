
import { createPrinter } from '../index.js';
import { getCuby } from '../utils/stuff.js';
import { writeHeadline, writePageTitle } from './utils.js';

const printer = createPrinter();

async function run () {
  writePageTitle(printer, 'Image Examples');

  writeHeadline(printer, 'Canvas');
  /**
   * Example Canvas
   */
  await printer.writeCanvas(getCuby(100));
  printer.feedPitchByFont(4);

  writeHeadline(printer, 'Image');

  /**
   * Example Image
   * Use Url or local path.
   */
  await printer.writeImage('img/devterm.jpeg', { width: 256 });
  // printer.feedPitchByFont(4);

  writeHeadline(printer, 'Barcode');

  /**
   * Example Barcode
   * See more: https://github.com/lindell/JsBarcode/wiki/Options
   */
  await printer.writeBarcode('123456789012',
    { format: 'EAN13' }, // QRCode Options
    { width: 300 } // Image Options
  );
  printer.feedPitchByFont(4);

  writeHeadline(printer, 'QR Code');

  /**
   * Example QRCode
   * See more: https://github.com/soldair/node-qrcode#qr-code-options
   */
  await printer.writeQRCode('DevTerm',
    { errorCorrectionLevel: 'H' }, // QRCode Options
    { width: 256 } // Image Options
  );

  printer.reset();
  printer.feedPitchByFont(14);
  printer.addCutline();
}

run();
