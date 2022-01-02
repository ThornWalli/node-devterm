
import SerialPort from 'serialport';

import {
  getDefaultConfig, ALIGN, ASCII_DC2, ASCII_ESC, ASCII_GS, FONT,
  IMAGE_MAX, MAX_DENSITY, MAX_DOTS, UNDERLINE, ASCII_FF, MAX_PIXELS_FONT, FONT_DIMENSIONS
} from 'node-devterm/config.js';
import {
  get8BitRowsFromImageData, getImageSize,
  splitCanvasInImageDataChunks
} from 'node-devterm/utils/image.js';
import { uint8ArrayToBuffer } from 'node-devterm/utils/buffer.js';
import font3x5 from 'node-devterm/charFonts/3x5.js';
import Table from 'node-devterm/Table.js';
import {
  getBarcode, getCanvasFromImage,
  getQRCode, prepareCanvasForPrint
} from 'node-devterm/utils/canvas.js';

const buffer = [];

const WRITE_DEFAULTS = {
  write: process.stdout.write,
  err: process.stderr.write
};

export default class Printer {
  constructor (serialPort) {
    if (!(serialPort instanceof SerialPort)) {
      throw new Error('SerialPort is missing!');
    }
    this.debug = false;
    this.active = true;
    // ###
    this.config = getDefaultConfig();
    this.serialPort = serialPort;
    this.serialPort.on('error', function (err) {
      throw err;
    });
  }

  async connect () {
    await new Promise((resolve, reject) => {
      this.serialPort.open(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
      this.debug && console.log('Connect to Printer');
    });
    this.connected = true;
  }

  async disconnect () {
    await new Promise(resolve => {
      this.debug && console.log('Disconnect from Printer');
      this.serialPort.close(resolve);
    });
    this.connected = false;
  }

  get fontWidth () {
    return FONT_DIMENSIONS[this.config.font][0];
  }

  get fontHeight () {
    return FONT_DIMENSIONS[this.config.font][1];
  }

  get marginCharsCount () {
    return ((this.config.margin * MAX_DOTS) / this.fontWidth);
  }

  get maxRowChars () {
    return MAX_PIXELS_FONT[this.config.font];
  }

  stdoutOverride (options) {
    const { write, err } = { write: true, err: true, ...options };
    const handler = this.write;
    err && (process.stderr.write = (...args) => {
      handler.bind(process.stderr)(...args);
      return WRITE_DEFAULTS.error.bind(process.stderr)(...args);
    });
    write && (process.stdout.write = (...args) => {
      handler.bind(process.stdout)(...args);
      return WRITE_DEFAULTS.write.bind(process.stdout)(...args);
    });
  }

  writeTextTable (data, columns, options) {
    return this.writeLine(this.createTextTable(data, columns, options).write());
  }

  createTextTable (data, columns, options) {
    return new Table(this, data, columns, options);
  }

  /**
   * Write Text from CharMap.
   * @param String string
   * @param Array charMap
   * @param Number width
   * @returns Promise
   */
  writeCharFont (string, charMap = font3x5, width = (this.maxRowChars - this.marginCharsCount)) {
    width = 1 + Math.round(((width - 3) / 4));

    const rows = Array(Math.ceil((string.length / width))).fill('')
      .map((v, index) => {
        return Array.from(string.slice(index * width, index * width + width)).map(c => charMap[c]);
      });

    const result = rows.reduce((result, chars) => {
      for (let y = 0; y < charMap[0].length; y++) {
        result && (result += '\n');
        for (let x = 0; x < chars.length; x++) {
          x && (result += ' ');
          result += chars[x][y];
        }
      }
      (result += '\n');
      return result;
    }, '');

    return this.writeLine(result);
  }

  /**
   * Send Buffe/String to printer.
   * @param Buffer|String value
   * @returns Promise
   */
  write (value) {
    return new Promise((resolve, reject) => {
      buffer.push(() => {
        this.debug && console.log('Write to Printer', value);
        if (this.active) {
          return (new Promise((resolve, reject) => {
            this.serialPort.write(value, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          })).then(resolve).catch(reject);
        } else {
          resolve();
        }
      });
      !this.running && (this.executeBuffer());
    });
  }

  async executeBuffer () {
    this.running = true;
    !this.connected && (await this.connect());
    if (buffer.length) {
      await buffer.shift()();
      return this.executeBuffer();
    } else {
      this.running = false;
      global.clearTimeout(this.timeout);
      this.timeout = global.setTimeout(async () => {
        await this.disconnect();
      }, 1000);
    }
  }

  /**
   * Prints a String.
   * @param String value
   * @returns Promise
   */
  writeLine (value) {
    if (this.debug) {
      value.split('\n').forEach(value => {
        const margin = this.config.margin * MAX_DOTS;
        const chars = Math.round((MAX_DOTS / this.fontWidth) - 1 - margin / this.fontWidth);
        for (let i = 0; i < value.length / chars; i++) {
          const line = ''.padStart(margin / this.fontWidth, ' ') + value.slice(i * chars, i * chars + chars);
          console.log(line);
        }
      });
    }
    value.split('\n').forEach(value => {
      this.write(Buffer.from(`${value}`));
      this.write(ASCII_FF);
    });

    // return this.write(ASCII_FF);
  }

  /**
   * Prints a Barcode. Uses `jsbarcode` for generating.
   * @param String text
   * @param Object barcodeOptions https://github.com/lindell/JsBarcode/wiki/Options
   * @param Object options
   * @returns Promise
   */
  writeBarcode (text, barcodeOptions, options) {
    return this.writeCanvas(getBarcode(text, barcodeOptions), options);
  }

  /**
   * Prints a QRCode. Uses `node-qrcode` for generating.
   * @param String text
   * @param Object qrCodeOptions https://github.com/soldair/node-qrcode#qr-code-options
   * @param Object options
   * @returns Promise
   */
  async writeQRCode (text, qrCodeOptions, options) {
    qrCodeOptions = qrCodeOptions || {};
    qrCodeOptions.width = qrCodeOptions?.width || options?.width || MAX_DOTS;

    return this.writeCanvas(await getQRCode(text, qrCodeOptions), options);
  }

  /**
   * Write Image from path or url, with optional width.
   * @param String url
   * @param Number width
   * @returns Promise
   */
  async writeImage (url, options = {}) {
    return this.writeCanvas(await getCanvasFromImage(url), { grayscale: true, ...options });
  }

  /**
   * Write Canvas with optional width.
   * @param Canvas canvas
   * @param Object options
   * @returns Promise
   */
  async writeCanvas (canvas, options) {
    canvas = prepareCanvasForPrint(canvas, options);
    return this.writeImageDataList(await splitCanvasInImageDataChunks(canvas));
  }

  /**
   * Prints a list of ImageData.
   * @param Arrar imageDatas List of ImageDatas with max Size.
   * @returns Promise
   */
  async writeImageDataList (imageDataList) {
    const write = async (imageData) => {
      const rows = get8BitRowsFromImageData(imageData);
      await this.writeBuffer(getWriteImageCommand(imageData.width, imageData.height));
      let pipe = Promise.resolve();
      for (let y = 0; y < rows.length; y++) {
        const buf = uint8ArrayToBuffer(rows[y]);
        pipe = pipe.then(() => this.write(buf));
      }
      return pipe;
    };

    return imageDataList.reduce((result, imageData) => result.then(() => write(imageData)), Promise.resolve());
  }

  /**
   * @param Array value
   * @returns Promise
   */
  writeBuffer (value) {
    return this.write(Buffer.from(value));
  }

  // commands

  /**
   * @returns Promise
   */
  reset () {
    this.config = getDefaultConfig();
    return this.writeBuffer([ASCII_ESC, 0x40]);
  }

  /**
   * Feed pitch by pixel.
   * @param Number count Number of pixels.
   * @returns Promise
   */
  feedPitchByPixel (count) {
    return this.writeBuffer([ASCII_ESC, 0x4a, posInt(count)]);
  }

  /**
   * Feed pitch by current font size.
   * @param Number rows Number of rows.
   * @returns Promise
   */
  feedPitchByFont (rows) {
    return this.writeBuffer([ASCII_ESC, 0x64, posInt(rows)]);
  }

  /**
   * Set Margin by percentage. (0-1)
   * @param Number value
   * @returns Promise
   */
  setMargin (value) {
    this.config.margin = value;
    const n = Math.abs(value) * this.maxRowChars * this.fontWidth * 8;
    const [nL, nH] = [(n / 8) % 256, (n / 8) / 256];
    return this.writeBuffer([ASCII_GS, 0x4c, nL, nH]);
  }

  /**
   * Set current font.
   * 8x16 A: 0
   * 8x16 B: 4
   * 5x7:    1
   * 6x12:   2
   * 7x14:   3
   * @param Number value Index from the Font.
   * @returns Promise
   */
  setFont (value) {
    this.config.font = posInt(value) % Object.values(FONT).length;
    return this.writeBuffer([ASCII_ESC, 0x21, this.config.font]);
  }

  /**
   * @param Number value Light 0-15 Dark
   * @returns Promise
   */
  setDensity (value) {
    this.config.density = posInt(value) % MAX_DENSITY;
    return this.writeBuffer([ASCII_DC2, 0x23, this.config.density]);
  }

  /**
   * @param Number value
   * @returns Promise
   */
  setWordGap (value) {
    this.config.wordGap = posInt(value);
    return this.writeBuffer([ASCII_ESC, 0x20, this.config.wordGap]);
  }

  /**
   * Set Align.
   * Left:   0
   * Center: 1
   * Right:  2
   * @param Number value
   * @returns Promise
   */
  setAlign (value) {
    value = posInt(value);
    if (value === 1 || value === 49) {
      this.config.align = ALIGN.CENTER;
    } else if (value === 2 || value === 50) {
      this.config.align = ALIGN.RIGHT;
    } else {
      this.config.align = ALIGN.LEFT;
    }
    return this.writeBuffer([ASCII_ESC, 0x61, this.config.align]);
  }

  /**
   * TODO: Was passiert hier?
   * @param Number value 1, 2, 3
   * @returns Promise
   */
  setUnderLine (value) {
    this.config.underline = posInt(value) % Object.values(UNDERLINE).length;
    return this.writeBuffer([ASCII_ESC, 0x2d, this.config.underline]);
  }

  /**
   * @param Number value
   * @returns Promise
   */
  setLineSpace (value) {
    this.config.lineSpace = value;
    return this.writeBuffer([ASCII_ESC, 0x33, this.config.lineSpace]);
  }

  /**
   * Add cut line.
   * @returns Promise
   */
  async addCutLine () {
    // fix margin, wordGap, lineSpace
    const { margin, wordGap, lineSpace } = this.config;
    this.setMargin(0);
    this.setWordGap(0);
    this.setLineSpace(0);
    this.writeBuffer([ASCII_GS, 0x56]);
    this.setMargin(margin);
    this.setWordGap(wordGap);
    return this.setLineSpace(lineSpace);
  }

  /**
   * Print internal test page
   * @returns Promise
   */
  testPage () {
    return this.writeBuffer([ASCII_DC2, 0x54]);
  }
}

const getWriteImageCommand = (width, height) => {
  const { xL, xH, yL, yH, k } = getImageSize(width, height);

  const cmd = [
    ASCII_GS,
    0x76, // 118
    0x30, // 48,
    0,
    xL, xH, yL, yH
  ];

  if (cmd[0] === ASCII_GS && cmd[1] === 118 && cmd[2] === 48) {
    if (!(k <= IMAGE_MAX)) {
      throw new Error(`Image too large; ${k} > ${IMAGE_MAX}`);
    }
  }

  return cmd;
};

const posInt = v => Math.abs(parseInt(v));
