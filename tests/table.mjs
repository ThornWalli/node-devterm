import { createPrinter } from '../index.js';
import { ALIGN, FONT } from '../utils/config.js';
import { getBattery, getTemperature } from '../utils/devterm.js';

const printer = createPrinter();

async function run () {
  printer.reset();

  printer.setAlign(ALIGN.CENTER);

  printer.setFont(FONT.SIZE_5_7);
  printer.writeLine(
    ['          #           #          #             ',
      '##  ### ### ###     ### ### # # ### ### ### ###',
      '# # # # # # ##  ### # # ##  # #  #  ##  #   ###',
      '# # ### ### ###     ### ###  #   ## ### #   # #'].join('\n'));

  await printer.writeStringGrid(async (width) => [
    printer.createTextTable([
      ['Battery:', await getBattery()],
      ['Temperature:', await getTemperature()]
    ], null, {
      title: 'DevTerm Info',
      border: true,
      header: true,
      width
    }).write(),
    printer.createTextTable([
      ['Battery:', await getBattery()],
      ['Temperature:', await getTemperature()]
    ], null, {
      title: 'DevTerm Info',
      border: true,
      header: true,
      width
    }).write()
  ], 2);

  // printer.feedPitchByFont(4);

  // const columns = [
  //   new TableColumn('Col. A', ALIGN.CENTER),
  //   new TableColumn('Col. B', ALIGN.LEFT),
  //   new TableColumn('Col. C', ALIGN.CENTER),
  //   new TableColumn('Col. D', ALIGN.LEFT),
  //   new TableColumn('Col. E', ALIGN.LEFT)
  // ];

  // const data = Array(3).fill(0).map((v, index_) =>
  //   Array(columns.length).fill(0).map((v, index) => index_ + index));

  // const tableConfig = [data, columns, {
  //   // title: 'Table Header',
  //   border: false,
  //   header: true,
  //   footer: true,
  //   width: 7 / 10
  // }];

  // printer.writeTextTable(...tableConfig);
  printer.reset();
  printer.feedPitchByFont(15);
}

run();
