import { createPrinter, TableColumn } from '../index.js';
import { ALIGN, FONT } from '../utils/config.js';
import { writeHeadline, writePageTitle } from './utils.js';

const printer = createPrinter();

async function run () {
  printer.reset();

  writePageTitle(printer, 'Table Examples');

  /**
   * Basic table
   */

  writeHeadline(printer, 'Basic');
  printer.writeTextTable([
    ['The table', 'with two columns'],
    ['Last row', 'is footer']
  ], null, {
    border: true,
    header: true,
    footer: true
  });

  /**
   * Advanced table
   */

  writeHeadline(printer, 'Advanced');

  printer.writeTextTable([
    ['Item A', 2],
    ['Item B', 4],
    ['Item C', 8],
    ['Item D', 16],
    ['Item E', 32],
    ['Item F', 64],
    ['Total Value', (2 + 4 + 8 + 16 + 32 + 64)]
  ], [
    new TableColumn('Item'),
    new TableColumn('Value', ALIGN.CENTER)
  ], {
    title: 'The table title',
    border: true,
    header: true,
    footer: true
  });

  /**
   * Table with width and margin
   */

  writeHeadline(printer, 'Table width and margin');
  printer.setAlign(ALIGN.LEFT);
  printer.setMargin(1 / 6);

  printer.writeTextTable([
    ['A', 2],
    ['B', 4],
    ['C', 8]
  ], [
    new TableColumn('Item', ALIGN.CENTER),
    new TableColumn('Value', ALIGN.CENTER)
  ], {
    border: true,
    width: 4 / 6
  });

  /**
   * Borderless Table
   */

  writeHeadline(printer, 'Borderless Table');
  printer.setAlign(ALIGN.LEFT);

  printer.setMargin(0);
  printer.setLineSpace(30);
  printer.setFont(FONT.SIZE_8_16_THIN_2);

  printer.writeTextTable([
    ['A', '1.00 $'],
    ['B', '3.75 $'],
    ['C', '4.80 $']
  ], [
    new TableColumn('Item', ALIGN.LEFT),
    new TableColumn('Value', ALIGN.RIGHT)
  ], {
    border: false
  });

  printer.setAlign(ALIGN.RIGHT);
  printer.setDensity(15);
  printer.writeLine(`${(1 + 3.75 + 4.8).toFixed(2)} $ `);

  printer.reset();
  printer.feedPitchByFont(15);
  printer.addCutline();
}

run();
