import { ShaderType } from './Shader';

abstract class Device {
  static instance: Device;

  constructor() {
    Device.instance = this;
  }

  createShader(_type: ShaderType, _source: string): WebGLShader {
    throw new Error(`${this.constructor.name} must implement 'createShader'`);
  }

  draw() {
    throw new Error(`${this.constructor.name} must implement 'draw'`);
  }
}

export default Device;
