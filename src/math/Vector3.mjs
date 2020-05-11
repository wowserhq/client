import math from '@wowserhq/math';

class Vector3 extends math.Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    super([x, y, z]);
  }

  get x() {
    return this[0];
  }

  set x(x) {
    this[0] = x;
  }

  get y() {
    return this[1];
  }

  set y(y) {
    this[1] = y;
  }

  get z() {
    return this[2];
  }

  set z(z) {
    this[2] = z;
  }

  copy(other) {
    this.set(other);
    return this;
  }

  // TODO: Remove this once new package is published
  setElements(x, y, z) {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    return this;
  }
}

export default Vector3;
