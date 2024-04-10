import { BlendMode } from '../gfx/types';

import DrawLayerType from './DrawLayerType';
import FramePointType from './components/abstract/FramePointType';
import FrameStrataType from './components/abstract/FrameStrataType';

export const stringToBlendMode = (string?: string) => {
  if (!string) return undefined;
  return BlendMode[string?.toUpperCase() as keyof typeof BlendMode];
};

export const stringToDrawLayerType = (string?: string) => {
  if (!string) return undefined;
  return DrawLayerType[string?.toUpperCase() as keyof typeof DrawLayerType];
};

export const stringToFramePointType = (string?: string) => {
  if (!string) return undefined;
  return FramePointType[string.toUpperCase() as keyof typeof FramePointType];
};

export const stringToFrameStrataType = (string?: string) => {
  if (!string) return undefined;
  return FrameStrataType[string?.toUpperCase() as keyof typeof FrameStrataType];
};
