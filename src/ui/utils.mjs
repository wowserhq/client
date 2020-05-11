import { BlendMode } from '../gfx/types';

import DrawLayerType from './DrawLayerType';
import FrameStrataType from './components/abstract/FrameStrata/Type';

export const stringToBlendMode = (str) => BlendMode[str.toUpperCase()];
export const stringToDrawLayerType = (str) => DrawLayerType[str.toUpperCase()];
export const stringToStrataType = (str) => FrameStrataType[str.toUpperCase()];
