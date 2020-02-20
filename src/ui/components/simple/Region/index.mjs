import ScriptRegion from '../../abstract/ScriptRegion';

class Region extends ScriptRegion {
  constructor(frame, drawLayerType, show) {
    super();

    if (frame) {
      this.setFrame(frame, drawLayerType, show);
    }
  }

  setFrame(frame, _drawLayerType, _show) {
    this._parent = frame;

    // TODO: Implementation
  }
}

export default Region;
