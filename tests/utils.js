import { ALIGN, FONT } from '../src/config.js';

export const writePageTitle = (printer, text) => {
  printer.reset();
  printer.feedPitchByFont(4);
  printer.setAlign(ALIGN.CENTER);
  printer.setFont(FONT.SIZE_5_7);
  printer.writeCharFont(text);
  printer.reset();
  printer.feedPitchByFont(4);
};

export const writeHeadline = (printer, text) => {
  printer.reset();
  printer.feedPitchByFont(2);
  printer.setDensity(15);
  printer.writeLine(text);
  printer.reset();
  printer.feedPitchByFont(2);
};
