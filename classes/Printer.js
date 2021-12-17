import {
  getDefaultConfig, ALIGN, ASCII_DC2, ASCII_ESC, ASCII_GS, FONT,
  IMAGE_MAX, MAX_DENSITY, MAX_DOTS, UNDERLINE, FONT_WIDTHS, ASCII_FF
} from '../utils/config.js';
import {
  flipCanvas, getBarcode, getBitRowsFromImageData, getCanvasFromImage,
  getImageSize, getQRCode, rotateCanvas90Deg, splitCanvasInImageDataChunks
} from '../utils/image.js';
import { uint8ArrayToBuffer } from '../utils/buffer.js';
import font3x5 from '../charFonts/3x5.js';
import Table from './Table.js';
import SerialPort from 'serialport';
import canvas from 'canvas';
const { Canvas } = canvas;

const buffer = [];

const WRITE_DEFAULTS = {
  write: process.stdout.write,
  err: process.stderr.write
};

export default class Printer {
  constructor (port) {
    if (!(port instanceof SerialPort)) {
      throw new Error('SerialPort is missing!');
    }
    this.debug = true;
    this.active = true;
    // ###
    this.config = getDefaultConfig();
    this.port = port;
    this.port.on('error', function (err) {
      throw err;
    });
  }

  get fontWidth () {
    return FONT_WIDTHS[this.config.font];
  }

  get marginCharsCount () {
    return (this.config.margin[0] / this.fontWidth);
  }

  get maxRowChars () {
    return MAX_DOTS / this.fontWidth;
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
 * Create String Grid
 * @param Printer printer
 * @param Function fnData
 * @param Number columns
 * @param Number gap Column Gap
 * @returns String
 */
  async writeStringGrid (fnData, columns = 1, gap = 2) {
    const width = this.fontWidth * Math.round((this.maxRowChars) / columns - ((columns - 1) * gap) / columns + (this.marginCharsCount / columns));

    gap = gap + gap % 2;
    const data = await fnData(width);
    if (data.length > columns) {
      throw new Error('More Data Columns as defined columns');
    }
    let rows = data.reduce((result, value, column) => {
      value.split('\n').forEach((v, i) => (result[column][i] = v));
      return result;
    }, Array(data.length).fill(null).map(Array));

    const length = rows.reduce((result, value) => Math.max(value.length, result), 0);
    rows = Array(length).fill(null).map((v, rowIndex) => rows.map((v, index) => rows[index][rowIndex]));

    return this.writeLine(rows.map((row) => row.map((v, i) => {
      if (i < row.length - 1) {
        return v.padEnd(v.length + gap, ' ');
      }
      return v;
    }).join('')).join('\n'));
  }

  writeCharFont (printer, string, charMap = font3x5, width = (MAX_DOTS - this.marginCharsCount)) {
    width = width / printer.fontWidth;
    width = 1 + Math.round(((width - 3) / 4));

    const rows = Array(Math.ceil((string.length / width))).fill('')
      .map((v, index) => {
        return Array.from(string.slice(index * width, index * width + width)).map(c => charMap[c]);
      });

    const result = rows.reduce((result, chars) => {
      for (let y = 0; y < 5; y++) {
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
   * @param {Buffer|String} value
   * @returns Promise
   */
  write (value) {
    if (!this.active) { return; }
    return new Promise((resolve, reject) => {
      buffer.push(() => this.port.write(value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }));
      !this.running && this.executeBuffer();
    });
  }

  executeBuffer () {
    if (buffer.length) {
      this.running = true;
      global.setTimeout(async () => {
        await buffer.shift()();
        this.executeBuffer();
      }, 50);
    } else { this.running = false; }
  }

  /**
   * @param String value
   * @returns Promise
   */
  writeLine (value) {
    if (this.debug) {
      const margin = this.config.margin[0];
      const chars = Math.round((MAX_DOTS / FONT_WIDTHS[this.config.font]) - 1 - margin / FONT_WIDTHS[this.config.font]);
      for (let i = 0; i < value.length / chars; i++) {
        const line = ''.padStart(margin / FONT_WIDTHS[this.config.font], ' ') + value.slice(i * chars, i * chars + chars);
        console.log(line);
      }
    }
    this.write(Buffer.from(`${value}`));
    return this.write(ASCII_FF);
  }

  /**
   * Draw Barcode
   * @param String text
   * @param Object barcodeOptions https://github.com/lindell/JsBarcode/wiki/Options
   * @param Object options
   * @returns Promise
   */
  writeBarcode (text, barcodeOptions, options) {
    return this.writeCanvas(getBarcode(text, barcodeOptions), options);
  }

  /**
   * Draw QRCode
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
   * Write  Image from path or url, with optional width.
   * @param String url
   * @param Number width
   * @returns Promise
   */
  async writeImage (url, options) {
    return this.writeCanvas(await getCanvasFromImage(url), options);
  }

  /**
   * Write Canvas with optional width.
   * @param Canvas canvas
   * @param Object options
   * @returns Promise
   */
  async writeCanvas (canvas, options) {
    options = { width: null, rotate: false, flipX: false, flipY: false, ...options };

    if (!(canvas instanceof Canvas)) {
      throw new Error('canvas is not instance of Canvas');
    }

    if (options.rotate) {
      canvas = rotateCanvas90Deg(canvas);
    }

    if (options.flipX || options.flipY) {
      canvas = flipCanvas(canvas, options.flipX, options.flipY);
    }

    // const imageDatas = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    const imageDatas = await splitCanvasInImageDataChunks(canvas, options.width);
    const write = async (imageData) => {
      const rows = getBitRowsFromImageData(imageData);
      await this.writeBuffer(getWriteImageCommand(imageData.width, imageData.height));
      let pipe = Promise.resolve();
      for (let y = 0; y < rows.length; y++) {
        const buf = uint8ArrayToBuffer(rows[y]);
        pipe = pipe.then(() => this.write(buf));
      }
      return pipe;
    };

    return imageDatas.reduce((result, imageData) => result.then(() => write(imageData)), Promise.resolve());
  }

  /**
   * @param {Array} value
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
   * Set Margin.
   * @param Number value
   * @returns Promise
   */
  setMargin (value) {
    const n = posInt(value) * FONT_WIDTHS[this.config.font];
    this.config.margin = [(n / 8) % 256, (n / 8) / 256];
    const [nL, nH] = this.config.margin;
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
  setWordgap (value) {
    this.config.wordgap = posInt(value);
    return this.writeBuffer([ASCII_ESC, 0x20, this.config.wordgap]);
  }

  /**
   * Set Align.
   * Left:   0
   * Center: 1
   * Right:  2
   * @param <Number> value
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
   * @param <Number> value 1, 2, 3
   * @returns Promise
   */
  setUnderLine (value) {
    this.config.underline = posInt(value) % Object.values(UNDERLINE).length;
    return this.writeBuffer([ASCII_ESC, 0x2d, this.config.underline]);
  }

  /**
   * @param <Number> value 1, 2, 3
   * @returns Promise
   */
  setLineSpace (value) {
    this.config.lineSpace = posInt(value.value) % 3;
    return this.writeBuffer([ASCII_ESC, 0x33, this.config.lineSpace]);
  }

  /**
   * Add cutline.
   * @returns Promise
   */
  addCutline (value) {
    return this.writeBuffer([ASCII_GS, 0x56, value]);
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
