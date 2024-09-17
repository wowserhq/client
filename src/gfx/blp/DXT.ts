// Based off of https://github.com/pasu/squishjs/blob/master/squish.js

//! Use DXT1 compression.
export const kDxt1 = 1 << 0;

//! Use DXT3 compression.
export const kDxt3 = 1 << 1;

//! Use DXT5 compression.
export const kDxt5 = 1 << 2;

const krgb565 = 1 << 5;

function Unpack565(
  packed0: number,
  packed1: number,
  colour: Uint8Array,
  offset: number
) {
  const value = packed0 | (packed1 << 8);

  const red = (value >> 11) & 0x1f;
  const green = (value >> 5) & 0x3f;
  const blue = value & 0x1f;

  colour[offset + 0] = (red << 3) | (red >> 2);
  colour[offset + 1] = (green << 2) | (green >> 4);
  colour[offset + 2] = (blue << 3) | (blue >> 2);
  colour[offset + 3] = 255;

  return value;
}

function DecompressColour(
  rgba: Uint8Array,
  block: Uint8Array,
  nOffset: number,
  isDxt1: boolean
) {
  const codes = new Uint8Array(16);

  const a = Unpack565(block[nOffset + 0], block[nOffset + 1], codes, 0);
  const b = Unpack565(block[nOffset + 2], block[nOffset + 3], codes, 4);

  for (let i = 0; i < 3; i++) {
    const c = codes[i];
    const d = codes[4 + i];

    if (isDxt1 && a <= b) {
      codes[8 + i] = (c + d) / 2;
      codes[12 + i] = 0;
    } else {
      codes[8 + i] = (2 * c + d) / 3;
      codes[12 + i] = (c + 2 * d) / 3;
    }
  }

  codes[8 + 3] = 255;
  codes[12 + 3] = isDxt1 && a <= b ? 0 : 255;

  const indices = new Uint8Array(16);
  for (let i = 0; i < 4; ++i) {
    const packed = block[nOffset + 4 + i];

    indices[4 * i + 0] = packed & 0x3;
    indices[4 * i + 1] = (packed >> 2) & 0x3;
    indices[4 * i + 2] = (packed >> 4) & 0x3;
    indices[4 * i + 3] = (packed >> 6) & 0x3;
  }

  for (let i = 0; i < 16; ++i) {
    const offset = 4 * indices[i];
    for (let j = 0; j < 4; ++j) {
      rgba[4 * i + j] = codes[offset + j];
    }
  }
}

function DecompressAlphaDxt3(rgba: Uint8Array, block: Uint8Array, nOffset: number) {
  // unpack the alpha values pairwise
  for (let i = 0; i < 8; ++i) {
    // quantise down to 4 bits
    const quant = block[nOffset + i];

    // unpack the values
    const lo = quant & 0x0f;
    const hi = quant & 0xf0;

    // convert back up to bytes
    rgba[8 * i + 3] = lo | (lo << 4);
    rgba[8 * i + 7] = hi | (hi >> 4);
  }
}

function DecompressAlphaDxt5(rgba: Uint8Array, block: Uint8Array, nOffset: number) {
  const alpha0 = block[nOffset + 0];
  const alpha1 = block[nOffset + 1];

  const codes = new Uint8Array(8);

  codes[0] = alpha0;
  codes[1] = alpha1;
  if (alpha0 <= alpha1) {
    // use 5-alpha codebook
    for (let i = 1; i < 5; ++i) {
      codes[1 + i] = ((5 - i) * alpha0 + i * alpha1) / 5;
    }
    codes[6] = 0;
    codes[7] = 255;
  } else {
    // use 7-alpha codebook
    for (let i = 1; i < 7; ++i) {
      codes[1 + i] = ((7 - i) * alpha0 + i * alpha1) / 7;
    }
  }

  const indices = new Uint8Array(16);
  nOffset = nOffset + 2;
  let nBegin = 0;
  for (let i = 0; i < 2; ++i) {
    // grab 3 bytes
    let value = 0;
    for (let j = 0; j < 3; ++j) {
      const byte = block[nOffset++];
      value |= byte << (8 * j);
    }

    // unpack 8 3-bit values from it
    for (let j = 0; j < 8; ++j) {
      const index = (value >> (3 * j)) & 0x7;
      indices[nBegin++] = index;
    }
  }

  for (let i = 0; i < 16; ++i) {
    rgba[4 * i + 3] = codes[indices[i]];
  }
}

export function Decompress(
  rgba: Uint8Array,
  block: Uint8Array,
  nOffset: number,
  flags: number
) {
  let nOffset2 = 0;
  if ((flags & (kDxt3 | kDxt5)) != 0) nOffset2 = 8;

  DecompressColour(rgba, block, nOffset + nOffset2, (flags & kDxt1) !== 0);

  if ((flags & kDxt3) != 0) {
    DecompressAlphaDxt3(rgba, block, nOffset);
  } else if ((flags & kDxt5) != 0) {
    DecompressAlphaDxt5(rgba, block, nOffset);
  }
}

function DecompressImage565(rgb565: Uint8Array, width: number, height: number, blocks: Uint8Array) {
  const c = new Uint16Array(4);
  const dst = rgb565;
  let m = 0;
  let dstI = 0;
  let i = 0;
  let r0 = 0,
    g0 = 0,
    b0 = 0,
    r1 = 0,
    g1 = 0,
    b1 = 0;

  const blockWidth = width / 4;
  const blockHeight = height / 4;
  for (let blockY = 0; blockY < blockHeight; blockY++) {
    for (let blockX = 0; blockX < blockWidth; blockX++) {
      i = 4 * (blockY * blockWidth + blockX);
      c[0] = blocks[i];
      c[1] = blocks[i + 1];
      r0 = c[0] & 0x1f;
      g0 = c[0] & 0x7e0;
      b0 = c[0] & 0xf800;
      r1 = c[1] & 0x1f;
      g1 = c[1] & 0x7e0;
      b1 = c[1] & 0xf800;
      // Interpolate between c0 and c1 to get c2 and c3.    ~
      // Note that we approximate 1/3 as 3/8 and 2/3 as 5/8 for
      // speed.  This also appears to be what the hardware DXT
      // decoder in many GPUs does :)
      c[2] =
        ((5 * r0 + 3 * r1) >> 3) |
        (((5 * g0 + 3 * g1) >> 3) & 0x7e0) |
        (((5 * b0 + 3 * b1) >> 3) & 0xf800);
      c[3] =
        ((5 * r1 + 3 * r0) >> 3) |
        (((5 * g1 + 3 * g0) >> 3) & 0x7e0) |
        (((5 * b1 + 3 * b0) >> 3) & 0xf800);
      m = blocks[i + 2];
      dstI = blockY * 4 * width + blockX * 4;
      dst[dstI] = c[m & 0x3];
      dst[dstI + 1] = c[(m >> 2) & 0x3];
      dst[dstI + 2] = c[(m >> 4) & 0x3];
      dst[dstI + 3] = c[(m >> 6) & 0x3];
      dstI += width;
      dst[dstI] = c[(m >> 8) & 0x3];
      dst[dstI + 1] = c[(m >> 10) & 0x3];
      dst[dstI + 2] = c[(m >> 12) & 0x3];
      dst[dstI + 3] = c[m >> 14];
      m = blocks[i + 3];
      dstI += width;
      dst[dstI] = c[m & 0x3];
      dst[dstI + 1] = c[(m >> 2) & 0x3];
      dst[dstI + 2] = c[(m >> 4) & 0x3];
      dst[dstI + 3] = c[(m >> 6) & 0x3];
      dstI += width;
      dst[dstI] = c[(m >> 8) & 0x3];
      dst[dstI + 1] = c[(m >> 10) & 0x3];
      dst[dstI + 2] = c[(m >> 12) & 0x3];
      dst[dstI + 3] = c[m >> 14];
    }
  }
  return dst;
}

/*! @brief Decompresses an image in memory.

 @param rgba		Storage for the decompressed pixels.
 @param width	The width of the source image.
 @param height	The height of the source image.
 @param blocks	The compressed DXT blocks.
 @param flags	Compression flags.

 The decompressed pixels will be written as a contiguous array of width*height
 16 rgba values, with each component as 1 byte each. In memory this is:

 { r1, g1, b1, a1, .... , rn, gn, bn, an } for n = width*height

 The flags parameter should specify either kDxt1, kDxt3 or kDxt5 compression,
 however, DXT1 will be used by default if none is specified. All other flags
 are ignored.

 Internally this function calls squish::Decompress for each block.
 */
function DecompressImage(rgba: Uint8Array, width: number, height: number, blocks: Uint8Array, flags: number) {
  const bytesPerBlock = (flags & kDxt1) != 0 ? 8 : 16;

  let nOffset = 0;
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const targetRgba = new Uint8Array(4 * 16);
      Decompress(targetRgba, blocks, nOffset, flags);

      let nOffsetTarget = 0;
      for (let py = 0; py < 4; ++py) {
        for (let px = 0; px < 4; ++px) {
          const sx = x + px;
          const sy = y + py;
          if (sx < width && sy < height) {
            let nBegin = 4 * (width * sy + sx);

            for (let i = 0; i < 4; ++i) {
              rgba[nBegin++] = targetRgba[nOffsetTarget++];
            }
          } else {
            nOffsetTarget += 4;
          }
        }
      }

      // advance
      nOffset += bytesPerBlock;
    }
  }
}

export function Decode(out: Uint8Array, width: number, height: number, block: Uint8Array, flags: number) {
  if (out == null || block == null || height == 0 || width == 0) {
    return;
  }

  if (flags & kDxt1 && flags & krgb565) {
    return DecompressImage565(out, width, height, block);
  } else {
    return DecompressImage(out, width, height, block, flags);
  }
}
