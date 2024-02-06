import Shader from '../../gfx/Shader';
import Texture from '../../gfx/Texture';
import { BlendMode } from '../../gfx/types';
import { TextureCoords, TexturePosition } from '../components/simple/Texture';

class RenderMesh {
  texture: Texture;
  _blendMode: BlendMode | null;
  shader: Shader | null;
  position: TexturePosition;
  textureCoords: TextureCoords;
  colors: never[];
  indices: number[];

  constructor(texture: Texture, position: TexturePosition, textureCoords: TextureCoords) {
    this.texture = texture;
    this._blendMode = null;
    this.shader = null;
    this.position = position;
    this.textureCoords = textureCoords;
    this.colors = [];
    this.indices = [];
  }

  get blendMode() {
    // TODO: This comparison might be incorrect
    if (this.colors.length && this.blendMode! < BlendMode.Alpha) {
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
