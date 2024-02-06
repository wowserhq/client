import { HashMap, HashStrategy } from '../utils';

import Texture from './Texture';

class TextureRegistry extends HashMap<string, Texture> {
  constructor() {
    super(HashStrategy.UPPERCASE);
  }

  lookup(path: string) {
    // TODO: BLP/TGA support instead of PNG
    path = `${path.replace(/\.blp|\.tga/i, '')}.png`;
    let texture = this.get(path);
    if (!texture) {
      texture = new Texture(path);
      this.set(path, texture);
    }
    return texture;
  }
}

export default TextureRegistry;
