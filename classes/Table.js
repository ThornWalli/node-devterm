import { ALIGN, FONT_WIDTHS, MAX_DOTS } from '../utils/config.js';
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
    this.width = width;
    this.title = title;
    this.border = border;
    this.header = header;
    this.footer = footer;
    this.columns = columns || [];
    this.data = data || [];
  }

  get maxChars () {
    return this.width / this.printer.fontWidth;
  }

  get rowLength () {
    return Math.round(
      Math.min(
        (this.maxChars - 1),
        Math.floor(this.maxChars - this.printer.marginCharsCount)
      )
    );
  }

  get columnLength () {
    let count = this.rowLength;

    if (this.border) {
      count -= (this.columns.length - 1) + 2;
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
          this.filledRow(this.rowLength, '-'),
       `|${alignValue(ALIGN.CENTER, clampValue(this.title, this.rowLength - 2), this.rowLength - 2, ' ')}|`
        );
      } else {
        rows.push(this.columnCenter(this.title, this.rowLength, ' '));
      }
    }
    this.border && rows.push(this.filledRow(this.rowLength, '-'));

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

  writeRow (row, fill) {
    const defaultPadSize = Math.floor(this.columnLength);
    const offsets = Array(this.columns.length).fill(0);
    let offset = Math.round((this.columnLength - defaultPadSize) * this.columns.length);

    const i = [0, 0];
    while (offset) {
      // if (
      //   offset % 2 === 0
      // ) {
      //   offsets[(offsets.length - 1) - i[0]]++;
      //   i[1]++;
      // } else {
      //   offsets[i[0]]++;
      //   i[0]++;
      // }
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
    }).join(this.border ? '|' : '');

    if (this.border) {
      return `|${content}|`;
    } else {
      return content;
    }
  }

  filledRow (length, char = ' ') {
    let border = '';
    if (this.border) {
      length -= 2;
      border = '|';
    }
    return `${border}${''.padStart(length, char[0])}${border}`;
  }

  getResultLine () {
    return this.writeRow([], '=');
  }

  getHorizontalLine () {
    return this.writeRow([], '-');
  }
}
