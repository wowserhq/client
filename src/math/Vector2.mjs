// TODO: Use @wowserhq/math

class Vector2 extends Float32Array {
  constructor(x = 0, y = 0) {
    super([x, y]);
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

  copy(other) {
    this.set(other);
    return this;
  }

  setElements(x, y) {
    this[0] = x;
    this[1] = y;
    return this;
  }
}

export default Vector2;
