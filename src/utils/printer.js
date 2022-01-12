import { ASCII_GS, IMAGE_MAX } from '../config';
import { uint8ArrayToBuffer } from './buffer';
import { get8BitRowsFromImageData, getImageSize, splitCanvasInImageDataChunks } from './image';

export const getWriteImageCommand = (width, height) => {
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

/**
 * Get Image write commands from canvas.
 * @param Array imageDatas List of ImageDatas with max Size.
 * @returns Array
 */
export const getImageWriteBuffersFromCanvas = async (canvas) => {
  const imageDatas = await splitCanvasInImageDataChunks(canvas);
  const commandBuffers = imageDatas.map(imageData => {
    const rows = get8BitRowsFromImageData(imageData);
    return [Buffer.from(getWriteImageCommand(rows[0].length * 8, imageData.height))].concat(rows.map(row => uint8ArrayToBuffer(row)));
  }).flat();
  return commandBuffers;
};
