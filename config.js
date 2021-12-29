export const MAX_DENSITY = 16;
export const IMAGE_MAX = 9224;
export const MAX_DOTS = 384;
export const MAX_PIXELS = 48;

export const ASCII_TAB = '\t'; // Horizontal tab
export const ASCII_LF = '\n'; // Line feed,10
export const ASCII_FF = '\f'; // Form feed
export const ASCII_CR = '\r'; // Carriage return
export const ASCII_EOT = 4; // End of Transmission
export const ASCII_DLE = 16; // Data Link Escape
export const ASCII_DC2 = 18; // Device control 2 //0x12
export const ASCII_ESC = 27; // Escape //0x1b
export const ASCII_FS = 28; // Field separator//0x1c
export const ASCII_GS = 29; // Group separator //0x1d

export const FONT = {
  SIZE_8_16_THIN_1: 0,
  SIZE_8_16_THIN_2: 4,
  SIZE_5_7: 1,
  SIZE_6_12: 2,
  SIZE_7_14: 3
};

export const MAX_PIXELS_FONT = {
  [FONT.SIZE_5_7]: 76,
  [FONT.SIZE_6_12]: 63,
  [FONT.SIZE_7_14]: 54,
  [FONT.SIZE_8_16_THIN_1]: 47,
  [FONT.SIZE_8_16_THIN_2]: 47
};

export const FONT_DIMENSIONS = {
  [FONT.SIZE_8_16_THIN_1]: [8, 16],
  [FONT.SIZE_8_16_THIN_2]: [8, 16],
  [FONT.SIZE_7_14]: [7, 14],
  [FONT.SIZE_6_12]: [6, 12],
  [FONT.SIZE_5_7]: [5, 7]
};

export const ALIGN = {
  LEFT: 0, CENTER: 1, RIGHT: 2
};
export const UNDERLINE = {
  A: 0, B: 1, C: 2
};

export const TEMPERATURE = { CELSIUS: 0, KELVIN: 1 };
export const ERROR = {
  IS_PAPER: 0x00,
  NO_PAPER: 0x01,
  HOT_PRINTER: 0x02
};

// defaults
export const getDefaultConfig = () => {
  return {
    align: ALIGN.LEFT,
    font: FONT.SIZE_8_16_THIN_1,
    margin: 0,
    underline: 0,
    lineSpace: 0,
    density: 6,
    underLine: 0,
    wordGap: 0
  };
};
