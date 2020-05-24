import { BlendMode } from '../../gfx/types';

class RenderMesh {
  constructor() {
    this.texture = null;
    this._blendMode = null;
    this.shader = null;
    this.position = null;
    this.textureCoords = [];
    this.colors = [];
    this.indices = [];
  }

  get blendMode() {
    if (this.colors.length && this.blendMode < BlendMode.Alpha) {
      return BlendMode.Alpha;
    } else {
      return this._blendMode;
    }
  }

  set blendMode(blendMode) {
    this._blendMode = blendMode;
  }
}

export default RenderMesh;
