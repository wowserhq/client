import { TextureFilter } from './types';

class TextureFlags {
  filter: number;
  wrapU: boolean;
  wrapV: boolean;
  forceMipTracking: boolean;
  generateMipMaps: boolean;

  constructor(
    filter = TextureFilter.Linear,
    wrapU = false,
    wrapV = false,
    forceMipTracking = false,
    generateMipMaps = false
  ) {
    this.filter = filter;
    this.wrapU = wrapU;
    this.wrapV = wrapV;
    this.forceMipTracking = forceMipTracking;
    this.generateMipMaps = generateMipMaps;

    // TODO: Render target and anisotropy
  }
}

export default TextureFlags;
