/* eslint-disable no-unused-vars */
import { createPrinter, getTemperatures, getBattery, getThermalPrinterTemperature, isDevTermA06, TableColumn, Printer } from '../src/index.js';
import { ALIGN, FONT } from '../src/config.js';
import { writeHeadline, writePageTitle } from './utils.js';

const printer = createPrinter();

async function run () {
  // writePageTitle(printer, 'tests');

  printer.reset();

  await printer.writeQRCode('test', {
    errorCorrectionLevel: 'M',
    margin: 0,
    scale: 4,
    small: false
  });
  printer.reset();
  printer.feedPitchByFont(14);
  printer.addCutLine();

  //   for (let i = 0; i <= 10; i++) {
  //     printer.setWordGap(i);
  //     printer.writeLine(`Wordgap ${i}`);
  //   }
  //   printer.addCutLine();

  //   for (let i = 0; i <= 20; i += 2) {
  //     const lineSpace = printer.fontHeight + i;
  //     printer.setLineSpace(lineSpace);
  //     printer.writeLine(`LineSpace ${lineSpace}`);
  //   }

  //   printer.addCutLine();

  // printer.setFont(FONT.SIZE_8_16_THIN_1);
  // printer.setMargin(0.5);
  // printer.setWordGap(10);
  // printer.setLineSpace(20);

  // printer.writeLine('test');
  // printer.addCutLine();
  // printer.addCutLine();
  // printer.writeLine('test');
}

run();
