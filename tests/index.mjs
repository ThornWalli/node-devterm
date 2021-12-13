/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable no-multiple-empty-lines */
import { join, resolve } from 'path';
import { createPrinter, TableColumn } from '../index.js';
import { ALIGN, IMAGE_MAX, ASCII_GS, ASCII_TAB, FONT, UNDERLINE, ASCII_ESC, ASCII_LF, ASCII_FF, MAX_PIXELS, MAX_DOTS, FONT_WIDTHS, ASCII_DC2 } from '../utils/config.js';
import { getBattery, getTemperature, readAdc } from '../utils/devterm.js';
const __dirname = resolve();

const printer = createPrinter();

async function run () {
  // fonts
  printer.reset();


  // printer.writeLine(Array(MAX_PIXELS).fill('X').join(''));
  const columns = [
    // new TableColumn(ALIGN.LEFT),
    // new TableColumn(ALIGN.CENTER),
    // new TableColumn(ALIGN.RIGHT),
    // new TableColumn(ALIGN.RIGHT),
    // new TableColumn(ALIGN.RIGHT),
    // new TableColumn(ALIGN.RIGHT),
    // new TableColumn(ALIGN.RIGHT)
    new TableColumn('Col. A', ALIGN.CENTER),
    new TableColumn('Col. B', ALIGN.LEFT),
    new TableColumn('Col. C', ALIGN.CENTER),
    new TableColumn('Col. D', ALIGN.LEFT)
    // new TableColumn('Col. E', ALIGN.LEFT)
  ];

  const data = Array(3).fill(0).map((v, index_) =>
    Array(columns.length).fill(0).map((v, index) => ''.padStart(10, index)));

  // printer.testPage();
  // console.log('Battery', await getBattery());
  // await printer.writeQRCode('https://lammpee.de', null, { width: 120 });
  // console.log('Temperature', await getTemperature());

  printer.setAlign(ALIGN.CENTER);
  // printer.active = false;
  printer.setFont(FONT.SIZE_5_7);
  //
  // printer.writeLine(Array(80).fill('X').join(''));
  // printer.writeLine(getText(printer, Object.keys(CHARS).join('')));
  printer.writeCharFont(printer, 'Lammpee');

  // printer.setMargin(0);
  // // printer.writeLine('ABCDEF...');

  // printer.writeTextTable([
  //   ['Battery:', await getBattery()],
  //   ['Temperature:', await getTemperature()]
  // ], null, {
  //   title: 'DevTerm Info',
  //   border: true,
  //   header: true,
  //   width: 1
  // });
  // // printer.writeLine('ABCDEF...');


  // const tableConfig = [data, columns, {
  //   // title: 'Table Header',
  //   border: false,
  //   header: true,
  //   footer: true,
  //   width: 7 / 10
  // }];

  // // printer.setFont(FONT.SIZE_5_7);
  // printer.writeTextTable(...tableConfig);
  printer.reset();
  printer.feedPitchByFont(15);
}

run();
