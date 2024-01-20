import ShaderRegistry from './ShaderRegistry';

class Device {
  constructor() {
    Device.instance = this;

    this.shaders = new ShaderRegistry();
  }

  createShader() {
    throw new Error(`${this.constructor.name} must implement 'createShader'`);
  }

  draw() {
    throw new Error(`${this.constructor.name} must implement 'draw'`);
  }
}

export default Device;
