import WebGL2Device from './gfx/apis/webgl2/WebGL2Device';
import WebGPUDevice from './gfx/apis/webgpu/WebGPUDevice';
import Screen from './gfx/Screen';
import TextureRegistry from './gfx/TextureRegistry';
import UIContext from './ui/UIContext';
import { fetch } from './utils';

class Client {
  constructor(canvas, { api }) {
    this.constructor.instance = this;

    this.fetch = fetch;

    switch (api) {
      default:
      case 'webgl2':
        this.device = new WebGL2Device(canvas);
        break;
      case 'webgpu':
        this.device = new WebGPUDevice(canvas);
        break;
    }

    this.screen = new Screen(canvas);
    this.textures = new TextureRegistry();
    this.ui = new UIContext();
  }
}

export default Client;
