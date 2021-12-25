import { ALIGN, MAX_DOTS } from '../utils/config.js';
import { alignValue, clampValue } from '../utils/string.js';

export class TableColumn {
  constructor (title, align, fill) {
    this.title = title;
    this.align = align || ALIGN.LEFT;
    this.fill = fill || ' ';
  }
}
export default class Table {
  constructor (printer, data, columns, options) {
    if (!columns || columns.length === 0) {
      columns = data[0].map(() => new TableColumn());
    }
    this.printer = printer;
    const { width, title, border, header, footer } = {
      width: MAX_DOTS,
      title: null,
      border: false,
      header: false,
      footer: false,
      ...(options || {})
    };
    this.width = width || 1;
    this.title = title;
    this.border = border;
    this.header = header;
    this.footer = footer;
    this.columns = columns || [];
    this.data = data || [];

    this.borderResultChar = '=';
    this.borderVerticalChar = '|';
    this.borderHorizontalChar = '-';
    this.borderEdgeChar = '+';
  }

  get maxChars () {
    return (this.width * MAX_DOTS) / this.printer.fontWidth;
  }

  get rowLength () {
    const value = Math.round(Math.min(this.printer.maxRowChars - this.printer.marginCharsCount, this.maxChars));

    return value;
    // return Math.round((this.maxChars - 1) - this.printer.marginCharsCount);
    // return Math.round(
    //   Math.min(
    //     (this.maxChars - 1) + this.printer.marginCharsCount,
    //     Math.floor((MAX_DOTS / this.printer.fontWidth) - this.printer.marginCharsCount)
    //   ) - this.printer.marginCharsCount
    // );
  }

  get columnLength () {
    let count = this.rowLength;

    count -= (this.columns.length - 1);
    if (this.border) {
      count -= 2;
    }

    count /= this.columns.length;
    return count;
  }

  write () {
    const topBottom = this.getHorizontalLine();
    let rows = [];
    if (this.header) {
      rows.push(...this.getHeader());
    } else if (this.border) {
      rows.push(topBottom);
    }

    rows = rows.concat(this.data.slice(0, this.footer ? -1 : undefined).map((row) => this.writeRow(row)));
    if (this.footer) {
      rows.push(...this.getFooter());
    }
    if (this.border) {
      rows.push(topBottom);
    }

    return rows.join('\n');
  }

  getHeader () {
    const rows = [];
    if (this.title) {
      if (this.border) {
        rows.push(
          this.filledRow(this.rowLength, this.borderHorizontalChar),
       `${this.borderVerticalChar}${alignValue(ALIGN.CENTER, clampValue(this.title, this.rowLength - 2), this.rowLength - 2, ' ')}${this.borderVerticalChar}`
        );
      } else {
        rows.push(this.columnCenter(this.title, this.rowLength, ' '));
      }
    }
    this.border && rows.push(this.filledRow(this.rowLength, this.borderHorizontalChar));

    const columnTitles = this.columns.map((column) => column.title);
    if (columnTitles.filter(Boolean).length) {
      rows.push(this.writeRow(columnTitles));
      if (this.border) {
        rows.push(this.getHorizontalLine());
      } else {
        rows.push(this.filledRow(this.rowLength));
      }
    }

    return rows;
  }

  getFooter () {
    const rows = [];
    const row = this.writeRow(this.data[this.data.length - 1]);
    if (this.border) {
      rows.push(this.getResultLine());
    } else {
      rows.push(this.filledRow(this.rowLength));
    }
    rows.push(row);
    return rows;
  }

  writeRow (row, fill, border = this.borderVerticalChar) {
    const defaultPadSize = Math.floor(this.columnLength);
    const offsets = Array(this.columns.length).fill(0);
    let offset = Math.round((this.columnLength - defaultPadSize) * this.columns.length);

    const i = [0, 0];
    while (offset) {
      offsets[i[0]]++;
      i[0]++;
      offset--;
    }

    const content = this.columns.map((column, index) => {
      const spacer = fill || column.spacer || ' ';
      const value = row[index] === undefined ? '' : String(row[index]);
      let padSize = defaultPadSize;
      padSize += offsets[index];
      return alignValue(column.align, clampValue(value, padSize), padSize, spacer);
    }).join(this.border ? this.borderVerticalChar : ' ');

    if (this.border) {
      return `${border}${content}${border}`;
    } else {
      return content;
    }
  }

  filledRow (length, char = ' ') {
    let border = '';
    if (this.border) {
      length -= 2;
      border = this.borderEdgeChar;
    }
    return `${border}${''.padStart(length, char[0])}${border}`;
  }

  getResultLine () {
    return this.writeRow([], this.borderResultChar, this.borderEdgeChar);
  }

  getHorizontalLine () {
    return this.writeRow([], this.borderHorizontalChar, this.borderEdgeChar);
  }
}
