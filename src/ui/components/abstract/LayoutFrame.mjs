class LayoutFrame {
  constructor(ui) {
    this.ui = ui;

    // TODO: Risk of flags prop clashing with other classes in hierarchy?
    this.flags = 0;
  }

  set deferredResize(enable) {
    if (enable) {
      this.flags |= 0x2;

      // TODO: Remove this layout frame from pending list if it's linked

      return;
    }

    this.flags &= ~0x2;

    if (this.flags & 0x4) {
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
