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



  printer.setMargin(0);
  // printer.writeLine('ABCDEF...');

  printer.writeTextTable([
    ['Battery:', await getBattery()],
    ['Temperature:', await getTemperature()]
  ], null, {
    title: 'DevTerm Info',
    border: true,
    header: true,
    width: 1
  });
  // printer.writeLine('ABCDEF...');


  const tableConfig = [data, columns, {
    // title: 'Table Header',
    border: false,
    header: true,
    footer: true,
    width: 7 / 10
  }];

  // printer.setFont(FONT.SIZE_5_7);
  printer.writeTextTable(...tableConfig);
  printer.reset();
  printer.feedPitchByFont(15);

  // printer.addCutline(0);
  // printer.addCutline(1);

  // await readAdc('/sys/class/power_supply/axp20x-battery/capacity');

  // const textGridGrid = new Table();
  // const text = textGridGrid.write();

  // for (let i = 0; i < text.length / 47; i++) {
  //   const line = text.slice(i * 47, i * 47 + 47);
  //   console.log(line);
  // }
  // printer.setFont(FONT.SIZE_8_16_1);
  // printer.writeTextTable(...tableConfig);

  // Object.values(FONT).forEach(font => {
  //   printer.setFont(font);
  //   printer.writeTextTable(...tableConfig);
  // });


  // printer.writeBuffer([ASCII_ESC, 0x76, 0]);
  // printer.feedPitchByFont(15);
  // printer.feedPitchByFont(1);
  // await printer.writeBarcode('00000000000000000000000000000000');
  // await printer.writeQRCode('https://lammpee.de');

  // printer.feedPitchByFont(10);
  // for (let i = 0; i < 255; i++) {
  //   printer.writeLine(`${String.fromCharCode(i)}\t${i}`);
  // }
  // Array(255).fill(0).forEach((v, i) =>);
  // printer.setAlign(ALIGN.LEFT);
  // printer.writeLine('test');
  // printer.setAlign(ALIGN.RIGHT);
  // printer.writeLine('test');

  // Fonts
  // printer.setFont(FONT.SIZE_5_7);
  // printer.writeLine('Font SIZE_5_7');
  // printer.setFont(FONT.SIZE_6_12);
  // printer.writeLine('Font SIZE_6_12');
  // printer.setFont(FONT.SIZE_7_14);
  // printer.writeLine('Font SIZE_7_14');
  // printer.setFont(FONT.SIZE_8_16_1);
  // printer.writeLine('Font SIZE_8_16_1');
  // printer.setFont(FONT.SIZE_8_16_2);
  // printer.writeLine('Font SIZE_8_16_2');

  // printer.feedPitchByFont(5);
  // printer.setAlign(ALIGN.LEFT);
  // printer.setAlign(ALIGN.CENTER);
  // await printer.writeQRCode('https://lammpee.de', { width: 64 });
  // printer.setAlign(ALIGN.RIGHT);
  // await printer.writeQRCode('https://lammpee.de', { width: 64 });


  // () => printer.writeBuffer([
  //   ASCII_GS,
  //   0x4c,
  //   0.5,
  //   0.5
  // ])

  // GS v 0 p wL wH hL hH d1…dk
  // if(cmd[0] == ASCII_GS && cmd[1] == 118 && cmd[2] == 48 ) {



  // printer.writeln(Array(50).fill('X').join('')),



  // await printer.writeBuffer([
  //   ASCII_GS,
  //   0x4c,
  //   40,
  //   20
  // ]),
  // printer.writeln(Array(50).fill('X').join('')),




  // console.log(cmd.toString());
  // actions.push(
  //   () => printer.writeBuffer(command)
  //   // () => printer.write(uint8ArrayToBuffer(imgData))
  // );



  // await printer.write('right');


  // await printer.setAlign(ALIGN.RIGHT);
  // await printer.writeln('RIGHT');
  // await printer.setAlign(ALIGN.CENTER);
  // await printer.writeln('Center');
  // await printer.setAlign(ALIGN.LEFT);
  // await printer.writeln('Left');

  // await printer.setUnderLine(UNDERLINE.A);
  // await printer.writeln('Underline');
  // await printer.setUnderLine(UNDERLINE.B);
  // await printer.writeln('Underline');
  // await printer.setUnderLine(UNDERLINE.C);
  // await printer.writeln('Underline');

  // await printer.feedPitchByPixel(10);
  // await printer.writeBuffer([
  //   ASCII_GS,
  //   0x4c,
  //   20,
  //   20
  // ]);
  // await printer.writeln('Lammpee');
  // await printer.feedPitchByFont(20);
  // outPort.on('data', (value) => {
  //   console.log(value);
  // });

  // await printer.writeln('##############');
  // await printSpacer(14);
}

run();
