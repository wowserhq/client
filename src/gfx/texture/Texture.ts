interface Texture {
  readonly image: HTMLImageElement | Uint8Array;
  readonly width: number;
  readonly height: number;
  readonly isLoaded: boolean;
}

export default Texture;
