import { Buffer } from 'buffer';

export const uint8ArrayToBuffer = function (array) {
  const buf = Buffer.alloc(array.byteLength);
  const view = new Uint8Array(array);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
};
