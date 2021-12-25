import { createPrinter, getA06Temperatures, getBattery, getThermalPrinterTemperature, isDevTermA06 } from '../index.js';
import { ALIGN } from '../utils/config.js';
import { writePageTitle } from './utils.js';

const printer = createPrinter();

async function run () {
  // fonts
  printer.reset();

  writePageTitle(printer, 'node-devterm');

  printer.setAlign(ALIGN.CENTER);

  await printer.writeImage('img/devterm.jpeg', { width: 128 });

  printer.feedPitchByFont(4);

  printer.writeTextTable([
    ['Type:', (await isDevTermA06()) ? 'A06' : '???'],
    ['Battery:', (await getBattery()) + ' %'],
    ['Printer Temp.:', (await getThermalPrinterTemperature()).toFixed(2) + ' C'],
    ...(await getA06Temperatures()).map((temp, i) => [`Temp. Zone ${i + 1}:`, (temp / 1000).toFixed(2) + ' C'])
  ], null, {
    title: 'DevTerm Info',
    border: true,
    header: true,
    width: 6 / 8
  });

  printer.feedPitchByFont(4);

  await printer.writeQRCode('https://github.com/ThornWalli/node-devterm',
    { errorCorrectionLevel: 'H' },
    { width: 128 }
  );

  printer.reset();
  printer.feedPitchByFont(14);
  printer.addCutline();
}

run();
