import { HashMap, HashStrategy } from '../utils';

import Shader, { ShaderType } from './Shader';

type ShaderPathFn = (_type: ShaderType, _name: string) => string;

class ShaderRegistry extends HashMap<string, Shader> {
  pathFor: ShaderPathFn;

  constructor(pathFor: ShaderPathFn) {
    super(HashStrategy.UPPERCASE);

    this.pathFor = pathFor;
  }

  shaderFor(type: ShaderType, name: string) {
    const path = this.pathFor(type, name);
    let shader = this.get(path);
    if (!shader) {
      shader = new Shader(type, path);
      this.set(path, shader);
    }
    return shader;
  }

  pixelShaderFor(name: string) {
    return this.shaderFor('pixel', name);
  }

  vertexShaderFor(name: string) {
    return this.shaderFor('vertex', name);
  }
}

export default ShaderRegistry;
