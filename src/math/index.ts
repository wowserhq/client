export { Matrix4, Vector2, Vector3 } from '@wowserhq/math';

export { default as EdgeRect } from './EdgeRect';
export { default as Rect } from './Rect';

export const EPSILON1 = 0.00000023841858;
export const EPSILON2 = 0.00000999999970;

export const areClose = (a: number, b: number, epsilon = EPSILON1) => (
  Math.abs(a - b) < epsilon
);
