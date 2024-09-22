import { BLP } from '../blp/BLP';
import fetch from '../../utils/fetch';
import type Texture from './Texture';

class BLPTexture implements Texture {
  path: string;
  blp?: BLP;

  constructor(path: string) {
    this.path = path;

    if (!path.endsWith('.blp')) {
      path += '.blp';
    }
    
    fetch(path, 'arrayBuffer').then(async (buffer) => {
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
