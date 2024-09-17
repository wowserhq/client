import { BLP } from '../blp/BLP';
import type Texture from './Texture';

class BLPTexture implements Texture {
  path: string;
  blp?: BLP;

  constructor(path: string) {
    this.path = path;

    fetch(`${path}.blp`).then(async (resp) => {
      const buffer = await resp.arrayBuffer();
      if (buffer.byteLength > 0) {
        this.blp = BLP.fromArray(buffer);
      }
    });
  }

  get width() {
    return this.blp?.width ?? 0;
  }

  get height() {
    return this.blp?.height ?? 0;
  }

  get image() {
    if (this.blp === undefined) {
      throw new Error('Tried to load BLP texture before it was loaded');
    }
    return this.blp.imageData;
  }

  get isLoaded() {
    return this.blp !== undefined;
  }
}

export default BLPTexture;
