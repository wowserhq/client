import Device from '../../gfx/Device';
import UIRoot from '../components/UIRoot';
import { Matrix4 } from '../../math';

class Renderer {
  constructor() {
    // TODO: Does not support stereo vertex shader yet
    this.vertexShader = Device.instance.shaders.shaderFor('vertex', 'UI');
    this.pixelShader = Device.instance.shaders.shaderFor('pixel', 'UI');

    this.program = null;
  }

  draw(batch) {
    // TODO: Drawing routine should use WebGL2Device

    const root = UIRoot.instance;
    const { gl } = Device.instance;
    const { pixelShader, vertexShader } = this;

    if (!this.program) {
      if (!pixelShader.isValid || !vertexShader.isValid) {
        return;
      }

      this.program = gl.createProgram();
      gl.attachShader(this.program, vertexShader.apiShader);
      gl.attachShader(this.program, pixelShader.apiShader);
      gl.linkProgram(this.program);

      const success = gl.getProgramParameter(this.program, gl.LINK_STATUS);
      if (!success) {
        console.error(gl.getProgramInfoLog(this.program));
        gl.deleteProgram(this.program);
        return;
      }
    }

    gl.useProgram(this.program);

    if (batch.meshes.length) {
      for (const mesh of batch.meshes) {
        const { image } = mesh.texture;

        const texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.RGBA8,
          image.width, image.height, 0,
          gl.RGBA, gl.UNSIGNED_BYTE, image
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        const posCount = mesh.position.length;
        const indexCount = mesh.indices.length;

        const size = 6;

        const data = new Float32Array(size * posCount);
        const dataBuffer = gl.createBuffer();

        const indices = new Uint8Array(mesh.indices);
        const indexBuffer = gl.createBuffer();

        if (indexCount) {
          for (let i = 0; i < posCount; ++i) {
            const [x, y, z] = mesh.position[i];
            const [u, v] = mesh.textureCoords[i];

            const offset = size * i;

            data[offset] = x;
            data[offset + 1] = y;
            data[offset + 2] = z;
            data[offset + 3] = 0xFFFFFFFF;
            data[offset + 4] = u;
            data[offset + 5] = v;
          }
        }

        const viewProjMatrixPtr = gl.getUniformLocation(this.program, 'viewProjMatrix');

        const positionPtr = gl.getAttribLocation(this.program, 'position');
        // const colorPtr = gl.getAttribLocation(this.program, 'color');
        const textureCoordsPtr = gl.getAttribLocation(this.program, 'textureCoords');

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(positionPtr);
        gl.vertexAttribPointer(positionPtr, 3, gl.FLOAT, false, 24, 0);

        // gl.enableVertexAttribArray(colorPtr);
        // gl.vertexAttribIPointer(colorPtr, 1, gl.UNSIGNED_INT, false, 24, 12);

        gl.enableVertexAttribArray(textureCoordsPtr);
        gl.vertexAttribPointer(textureCoordsPtr, 2, gl.FLOAT, false, 24, 16);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        // TODO: Do not hardcode these matrices here
        const projMatrix = new Matrix4([
          2.50000024, 0, 0, 0,
          0, 3.33333349, 0, 0,
          -0, -0, -0.00200000009, 0,
          0, 0, 0, 1,
        ]);
        const offsetX = (root.rect.minX + root.rect.maxX) * 0.5;
        const offsetY = (root.rect.minY + root.rect.maxY) * 0.5;
        const viewProjMatrix = new Matrix4();
        viewProjMatrix.translate([-offsetX, -offsetY, 0.0]);
        viewProjMatrix.multiply(projMatrix).transpose();
        gl.uniformMatrix4fv(viewProjMatrixPtr, false, viewProjMatrix);

        gl.useProgram(this.program);
        gl.bindVertexArray(vao);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
      }
    }

    // TODO: Font rendering
    // TODO: Callbacks
  }
}

export default Renderer;
