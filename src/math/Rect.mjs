class Rect {
  constructor({
    minY = 0,
    minX = 0,
    maxY = 0,
    maxX = 0,
  } = {}) {
    this.minY = minY;
    this.minX = minX;
    this.maxY = maxY;
    this.maxX = maxX;
  }

  set(other) {
    this.minY = other.minY;
    this.minX = other.minX;
    this.maxY = other.maxY;
    this.maxX = other.maxX;
    return this;
  }
}

export default Rect;
