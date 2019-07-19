class LayoutFrame {
  constructor() {
    this.layoutFlags = 0;

    this.rect = new Rect();
    this._width = 0;
    this._height = 0;

    this.layoutScale = 1.0;
    this.layoutDepth = 1.0;

    this.guard = 0;
  }

  get layoutParent() {
    return null;
  }

  set deferredResize(enable) {
    if (enable) {
      this.layoutFlags |= 0x2;

      // TODO: Remove this layout frame from pending list if it's linked

      return;
    }

    this.layoutFlags &= ~0x2;

    if (this.layoutFlags & 0x4) {
      this.resize(true);
    }
  }

  resize(force = false) {
    // TODO
  }

  static resizePending() {
    // TOOD: Mark frames as resized
  }
}

export default LayoutFrame;
