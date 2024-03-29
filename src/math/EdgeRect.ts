class EdgeRect {
  top: number;
  left: number;
  bottom: number;
  right: number;

  constructor({
    top = 0,
    left = 0,
    bottom = 0,
    right = 0,
  } = {}) {
    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
  }
}

export default EdgeRect;
