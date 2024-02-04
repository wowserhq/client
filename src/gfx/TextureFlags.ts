class TextureFlags {
  constructor({
    filter, wrapU, wrapV,
    forceMipTracking, generateMipMaps,
  } = {}) {
    this.filter = filter;
    this.wrapU = wrapU;
    this.wrapV = wrapV;
    this.forceMipTracking = forceMipTracking;
    this.generateMipMaps = generateMipMaps;

    // TODO: Render target and anisotropy
  }
}

export default TextureFlags;
