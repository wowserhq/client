import Device from './Device';
import { LinkedList, LinkStrategy } from '../utils';

import ScreenLayer from './ScreenLayer';
import WebGL2Device from './apis/webgl2/WebGL2Device';

class Screen {
  static instance: Screen;

  canvas: HTMLCanvasElement;
  layers: LinkedList<ScreenLayer>;
  debugProgram?: WebGLProgram;

  constructor(canvas: HTMLCanvasElement) {
    Screen.instance = this;

    this.canvas = canvas;
    this.layers = LinkedList.using('zorderLink');

    this.render = this.render.bind(this);

    // Required for now to ensure the rendering program is loaded when needed
    this.debugLines();
  }

  getViewport() {
    return this;
  }

  setViewport(_minX: number, _maxX: number, _minY: number, _maxY: number, _minZ: number, _maxZ: number) {
    // TODO: Set viewport
  }

  render() {
    // TODO: Generic device interface
    const { gl } = Device.instance as WebGL2Device;

    console.group('render');

    // Ensure canvas is properly sized
    const {
      clientWidth: displayWidth,
      clientHeight: displayHeight,
      width,
      height,
    } = this.canvas;

    if (width !== displayWidth || height !== displayHeight) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
    }

    // TODO: Base rect

    for (const layer of this.layers) {
      const { visibleRect, rect } = layer;
      visibleRect.left = Math.max(visibleRect.left, rect.left);
      visibleRect.bottom = Math.max(visibleRect.bottom, rect.bottom);
      visibleRect.right = Math.max(visibleRect.right, rect.right);
      visibleRect.top = Math.max(visibleRect.top, rect.top);

      // TODO: Combinatory magic with base rect
    }

    // TODO: Viewport
    // const _viewport = this.viewport;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (const layer of this.layers) {
      const { visibleRect } = layer;
      if (visibleRect.right <= visibleRect.left) {
        continue;
      }
      if (visibleRect.top <= visibleRect.bottom) {
        continue;
      }

      if (layer.flags & 0x4) {
        this.setViewport(0, 1, 0, 1, 0, 1);
      } else {
        this.setViewport(
          visibleRect.left, visibleRect.right,
          visibleRect.bottom, visibleRect.top,
          0, 1);
      }

      if (layer.flags & 0x2) {
        // TODO: Ortho projection
      }

      // TODO: Calculate elapsed time
      const elapsedSecs = 0;
      layer.render(layer.param, layer.rect, layer.visibleRect, elapsedSecs);
    }

    // TODO: Restore viewport

    // TODO: Screen capturing

    // const device = Device.instance;
    // device.presentScene();

    this.debugLines();

    console.groupEnd();

    // TODO: Render again
    // requestAnimationFrame(this.render);
  }

  createLayer(...args: ConstructorParameters<typeof ScreenLayer>) {
    const layer = new ScreenLayer(...args);
    this.addLayer(layer);
    return layer;
  }

  addLayer(layer: ScreenLayer) {
    const { zorder } = layer;

    let target = this.layers.head;
    while (target && zorder < target.zorder) {
      target = target.zorderLink.next?.entity;
    }

    this.layers.link(layer, LinkStrategy.BEFORE, target);
  }

  debugLines() {
    // TODO: Generic device interface
    const device = Device.instance as WebGL2Device;
    const { gl } = device;

    if (!this.debugProgram) {
      const pixelShader = device.shaders.pixelShaderFor('DebugLine');
      const vertexShader = device.shaders.vertexShaderFor('DebugLine');
      if (!pixelShader.isValid || !vertexShader.isValid) {
        return;
      }

      this.debugProgram = gl.createProgram()!;
      gl.attachShader(this.debugProgram, vertexShader.apiShader!);
      gl.attachShader(this.debugProgram, pixelShader.apiShader!);
      gl.linkProgram(this.debugProgram);

      const success = gl.getProgramParameter(this.debugProgram, gl.LINK_STATUS);
      if (!success) {
        console.error(gl.getProgramInfoLog(this.debugProgram));
        gl.deleteProgram(this.debugProgram);
        return;
      }
    }

    gl.useProgram(this.debugProgram);

    const positionPtr = gl.getAttribLocation(this.debugProgram, 'position');

    const vertical = (x: number) => [x, -1, x, 1];
    const horizontal = (y: number) => [-1, y, 1, y];

    const dataBuffer = gl.createBuffer();
    const data = new Float32Array([
      ...vertical(-1),
      ...vertical(-0.5),
      ...vertical(0),
      ...vertical(0.5),
      ...vertical(0.999),

      ...horizontal(-1),
      ...horizontal(-0.5),
      ...horizontal(0),
      ...horizontal(0.5),
      ...horizontal(0.999),
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(positionPtr);
    gl.vertexAttribPointer(positionPtr, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINES, 0, data.length / 2);
  }
}

export default Screen;
