import Client from '../Client';
import Device from './Device';

type ShaderType = 'vertex' | 'pixel'

class Shader {
  type: ShaderType;
  path: string;
  isLoaded: boolean;

  source?: string;
  apiShader?: WebGLShader;

  constructor(type: ShaderType, path: string) {
    this.type = type;
    this.path = path;
    this.isLoaded = false;

    this.onSourceLoaded = this.onSourceLoaded.bind(this);

    Client.instance.fetch(path).then(this.onSourceLoaded);
  }

  get isValid() {
    return this.isLoaded;
  }

  onSourceLoaded(source: string) {
    this.source = source;

    const device = Device.instance;
    this.apiShader = device.createShader(this.type, this.source);

    this.isLoaded = true;
  }
}

export default Shader;
export type { ShaderType };
