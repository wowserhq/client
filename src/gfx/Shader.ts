import Client from '../Client';
import Device from './Device';

class Shader {
  constructor(type, path) {
    this.type = type;
    this.path = path;
    this.data = null;
    this.isLoaded = false;

    this.onSourceLoaded = this.onSourceLoaded.bind(this);

    Client.instance.fetch(path).then(this.onSourceLoaded);
  }

  get isValid() {
    return this.isLoaded;
  }

  onSourceLoaded(source) {
    this.source = source;

    const device = Device.instance;
    this.apiShader = device.createShader(this.type, this.source);

    this.isLoaded = true;
  }
}

export default Shader;
