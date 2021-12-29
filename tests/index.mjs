import { createPrinter, getTemperatures, getBattery, getThermalPrinterTemperature, isDevTermA06, TableColumn } from '../index.js';
import { ALIGN } from '../config.js';
import { writeHeadline, writePageTitle } from './utils.js';

const printer = createPrinter();

async function run () {
  // fonts
  printer.reset();

  writePageTitle(printer, 'node-devterm');

  printer.setAlign(ALIGN.CENTER);

  await printer.writeImage('img/devterm.jpeg', { width: 128 });

  printer.feedPitchByFont(4);

  printer.setLineSpace(30);
  writeHeadline(printer, 'General');
  printer.writeTextTable([
    ['Type', (await isDevTermA06()) ? 'A06' : '???'],
    ['Battery', (await getBattery()) + ' %']
  ], null, {
    border: false,
    width: 6 / 8
  });

  printer.reset();
  printer.feedPitchByFont(2);

  printer.setLineSpace(30);
  writeHeadline(printer, 'Temperatures');
  printer.writeTextTable([
    ['Printer', (await getThermalPrinterTemperature()).toFixed(2)],
    ...(await getTemperatures()).map((temp, i) => [`Zone ${i + 1}`, temp.toFixed(2)])
  ], [
    new TableColumn('Type'),
    new TableColumn('Celsius')
  ], {
    header: true,
    border: false,
    width: 6 / 8
  });

  printer.feedPitchByFont(4);
  printer.setAlign(ALIGN.CENTER);

  await printer.writeQRCode('https://github.com/ThornWalli/node-devterm',
    { errorCorrectionLevel: 'H' },
    { width: 128 }
  );

  printer.reset();
  printer.feedPitchByFont(14);
  printer.addCutLine();
}

run();
