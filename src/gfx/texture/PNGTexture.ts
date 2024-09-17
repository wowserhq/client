import type Texture from './Texture';

class PNGTexture implements Texture {
  path: string;
  isLoaded: boolean;
  image: HTMLImageElement;

  constructor(path: string) {
    this.path = path;
    this.isLoaded = false;

    this.onLoaded = this.onLoaded.bind(this);

    this.image = new Image();
    this.image.addEventListener('load', this.onLoaded);
    this.image.src = path;
  }

  get width() {
    return this.image && this.image.width;
  }

  get height() {
    return this.image && this.image.height;
  }

  onLoaded() {
    this.isLoaded = true;
  }
}

export default PNGTexture;
