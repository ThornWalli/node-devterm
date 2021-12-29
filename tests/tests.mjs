/* eslint-disable no-unused-vars */
import { createPrinter, getTemperatures, getBattery, getThermalPrinterTemperature, isDevTermA06, TableColumn, Printer } from '../index.js';
import { ALIGN, FONT } from '../config.js';
import { writeHeadline, writePageTitle } from './utils.js';

const printer = createPrinter();

async function run () {
  // writePageTitle(printer, 'tests');

  printer.reset();

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

  printer.setFont(FONT.SIZE_8_16_THIN_1);
  printer.setMargin(0.5);
  printer.setWordGap(10);
  printer.setLineSpace(20);

  printer.writeLine('test');
  printer.addCutLine();
  printer.addCutLine();
  printer.writeLine('test');

  printer.reset();
  printer.feedPitchByFont(14);
  printer.addCutLine();
}

run();
