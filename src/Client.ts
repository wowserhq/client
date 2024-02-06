import Device from './gfx/Device';
import WebGL2Device from './gfx/apis/webgl2/WebGL2Device';
import WebGPUDevice from './gfx/apis/webgpu/WebGPUDevice';
import Screen from './gfx/Screen';
import TextureRegistry from './gfx/TextureRegistry';
import UIContext from './ui/UIContext';
import { fetch } from './utils';

type ClientOptions = {
  api: 'webgl2' | 'webgpu' | string
}

class Client {
  static instance: Client;

  fetch: typeof fetch;
  device: Device;
  screen: Screen;
  textures: TextureRegistry;
  ui: UIContext;

  constructor(canvas: HTMLCanvasElement, { api }: ClientOptions) {
    Client.instance = this;

    this.fetch = fetch;

    switch (api) {
      default:
      case 'webgl2':
        this.device = new WebGL2Device(canvas);
        break;
      case 'webgpu':
        this.device = new WebGPUDevice();
        break;
    }

    this.screen = new Screen(canvas);
    this.textures = new TextureRegistry();
    this.ui = new UIContext();
  }
}

export default Client;
