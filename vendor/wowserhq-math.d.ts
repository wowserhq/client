// TODO: Types should come from @wowserhq/math package itself

declare module '@wowserhq/math' {
  type InputVector3 = Vector3 | [number, number, number];

  class Matrix4 extends Float32Array {
    multiply(r: Matrix4): this;
    translate(move: InputVector3): this;
    transpose(): this;
  }

  class Vector2 extends Float32Array {
    x: number;
    y: number;

    setElements(x: number, y: number): this;
  }

  class Vector3 extends Float32Array {
    x: number;
    y: number;
    z: number;

    setElements(x: number, y: number, z: number): this;
  }
}
