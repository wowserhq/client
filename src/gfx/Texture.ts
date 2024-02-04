class Texture {
  constructor(path) {
    this.path = path;
    this.isLoaded = false;

    this.onLoaded = this.onLoaded.bind(this);

    // TODO: BLP/TGA support instead of PNG
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

export default Texture;
