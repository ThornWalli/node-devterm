import { ALIGN } from 'devterm/config';

export const alignValue = (align, value, size, spacer) => {
  switch (align) {
    case ALIGN.CENTER:
      return value.padStart((value.length + size) / 2, spacer).padEnd(size, spacer);
    case ALIGN.RIGHT:
      return value.padStart(size, spacer);
    case ALIGN.LEFT:
    default:
      return value.padEnd(size, spacer);
  }
};
export const clampValue = (value, size, endChar = '.') => {
  if (value.length < size) {
    return value;
  }
  return value.slice(0, size - 2).padEnd(size, endChar);
};
