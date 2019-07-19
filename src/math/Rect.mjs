class Rect {
  constructor(left = 0, bottom = 0, right = 0, top = 0) {
    this.left = left;
    this.bottom = bottom;
    this.right = right;
    this.top = top;
  }

  get args() {
    return [this.left, this.bottom, this.right, this.top];
  }
}

export default Rect;
