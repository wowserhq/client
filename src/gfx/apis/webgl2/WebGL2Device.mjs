import Device from '../../Device';
import ShaderRegistry from '../../Shader/Registry.mjs';
import constantsFor from './constants';

class WebGL2Device extends Device {
  constructor(canvas) {
    super(canvas);

    // TODO: Handle context loss
    this.gl = canvas.getContext('webgl2');
    this.constants = constantsFor(this.gl);

    this.shaders = new ShaderRegistry((type, name) => {
      const ext = type === 'pixel' ? 'frag' : 'vert';
      return `Shaders\\${type}\\glsles300\\${name}.${ext}`;
    });
  }

  createShader(type, source) {
    const { gl } = this;
    const shaderType = type === 'pixel' ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER;
    const shader = this.gl.createShader(shaderType);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    const msg = this.gl.getShaderInfoLog(shader);
    this.gl.deleteShader(shader);
    throw new Error(`Could not create shader: ${msg}`);
  }
}

export default WebGL2Device;
