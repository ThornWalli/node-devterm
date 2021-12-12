import { ALIGN, FONT_WIDTHS, MAX_DOTS } from '../utils/config.js';

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
      width: 1,
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

  get fontWidth () {
    return FONT_WIDTHS[this.printer.config.font];
  }

  get maxChars () {
    return MAX_DOTS / this.fontWidth;
  }

  get marginCharsCount () {
    return (this.printer.config.margin[0] / this.fontWidth);
  }

  get rowLength () {
    const width = Math.min(Math.max(this.width, 0.1), 1);
    return Math.round(
      Math.min(
        (this.maxChars * width - 1),
        Math.floor(this.maxChars - this.marginCharsCount)
      )
    );
  }

  get rowEndLength () {
    const width = Math.min(Math.max(this.width, 0.1), 1);
    const rowWidth = this.maxChars * (1 - width);
    return Math.round((rowWidth - Math.floor(this.marginCharsCount)));
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
    rows = rows.map(row => row.padEnd(this.rowLength + this.rowEndLength, ' '));

    return rows.join('');
  }

  getHeader () {
    const rows = [];
    if (this.title) {
      if (this.border) {
        rows.push(
          this.filledRow(this.rowLength, '-'),
       `|${alignValue(ALIGN.CENTER, this.title, this.rowLength - 2, ' ')}|`
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
      return alignValue(column.align, value, padSize, spacer);
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

const alignValue = (align, value, size, spacer) => {
  switch (align) {
    case ALIGN.CENTER:
      value = clampValue(value, size);
      return value.padStart((value.length + size) / 2, spacer).padEnd(size, spacer);
    case ALIGN.RIGHT:
      return clampValue(value, size).padStart(size, spacer);
    case ALIGN.LEFT:
    default:
      return clampValue(value, size).padEnd(size, spacer);
  }
};

const clampValue = (value, size) => {
  if (value.length < size) {
    return value;
  }
  return value.slice(0, size - 2).padEnd(size, '.');
};
