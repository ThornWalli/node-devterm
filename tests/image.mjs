
import { createPrinter } from '../index.js';
import { ALIGN } from '../utils/config.js';
import { getCuby } from '../utils/stuff.js';

const printer = createPrinter();

async function run () {
  printer.setAlign(ALIGN.CENTER);
  printer.feedPitchByFont(4);

  /**
   * Example Canvas
   */
  await printer.writeCanvas(getCuby(100));
  printer.feedPitchByFont(4);

  /**
   * Example Image
   * Use Url or local path.
   */
  await printer.writeImage('img/devterm.jpeg', { width: 256 });
  printer.feedPitchByFont(4);

  /**
   * Example Barcode
   * See more: https://github.com/lindell/JsBarcode/wiki/Options
   */
  await printer.writeBarcode('123456789012',
    { format: 'EAN13' }, // QRCode Options
    { width: 300 } // Image Options
  );
  printer.feedPitchByFont(4);

  /**
   * Example QRCode
   * See more: https://github.com/soldair/node-qrcode#qr-code-options
   */
  await printer.writeQRCode('https://github.com/ThornWalli/node-devterm',
    { errorCorrectionLevel: 'H' }, // QRCode Options
    { width: 256 } // Image Options
  );

  printer.feedPitchByFont(10);
  printer.addCutline();
}

run();
