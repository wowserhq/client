export { default as EdgeRect } from './EdgeRect';
export { default as Matrix4 } from './Matrix4';
export { default as Rect } from './Rect';
export { default as Vector2 } from './Vector2';
export { default as Vector3 } from './Vector3';

export const EPSILON1 = 0.00000023841858;
export const EPSILON2 = 0.00000999999970;

export const areClose = (a, b, epsilon = EPSILON1) => (
  Math.abs(a - b) < epsilon
);
