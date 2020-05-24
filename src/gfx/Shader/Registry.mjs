import { HashMap, HashStrategy } from '../../utils';

import Shader from '.';

class ShaderRegistry extends HashMap {
  constructor(pathFor) {
    super(HashStrategy.UPPERCASE);

    this.pathFor = pathFor;
  }

  shaderFor(type, name) {
    const path = this.pathFor(type, name);
    let shader = this.get(path);
    if (!shader) {
      shader = new Shader(type, path);
      this.set(path, shader);
    }
    return shader;
  }

  pixelShaderFor(name) {
    return this.shaderFor('pixel', name);
  }

  vertexShaderFor(name) {
    return this.shaderFor('vertex', name);
  }
}

export default ShaderRegistry;
