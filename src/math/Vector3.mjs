import math from '@wowserhq/math';

class Vector3 extends math.Vector3 {
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
}

export default Vector3;
