import math from '@wowserhq/math';

class Matrix4 extends math.Matrix4 {
  // TODO: Remove this once new package is published
  translate(move) {
    this[12] = this[8]  * move[2] + this[4] * move[1] + this[0] * move[0] + this[12];
    this[13] = this[9]  * move[2] + this[5] * move[1] + this[1] * move[0] + this[13];
    this[14] = this[10] * move[2] + this[6] * move[1] + this[2] * move[0] + this[14];
    return this;
  }
}

export default Matrix4;
