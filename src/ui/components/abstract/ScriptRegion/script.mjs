import {
  DDCtoNDCWidth,
  maxAspectCompensation,
} from '../../../../utils';
import { lua_pushnumber } from '../../../scripting/lua';

import ScriptRegion from '.';

export const IsProtected = () => {
  return 0;
};

export const CanChangeProtectedState = () => {
  return 0;
};

export const SetParent = () => {
  return 0;
};

export const GetRect = () => {
  return 0;
};

export const GetCenter = () => {
  return 0;
};

export const GetLeft = () => {
  return 0;
};

export const GetRight = () => {
  return 0;
};

export const GetTop = () => {
  return 0;
};

export const GetBottom = () => {
  return 0;
};

export const GetWidth = (L) => {
  const region = ScriptRegion.getObjectFromStack(L);
  const { width } = region;

  // TODO: Width === 0.0

  const ddcx = maxAspectCompensation * width;
  const ndcx = DDCtoNDCWidth(ddcx);
  lua_pushnumber(L, ndcx);
  return 1;
};

export const SetWidth = () => {
  return 0;
};

export const GetHeight = (L) => {
  const region = ScriptRegion.getObjectFromStack(L);
  const { height } = region;

  // TODO: Height === 0.0

  const ddcy = maxAspectCompensation * height;
  const ndcy = DDCtoNDCWidth(ddcy);
  lua_pushnumber(L, ndcy);
  return 1;
};

export const SetHeight = () => {
  return 0;
};

export const SetSize = () => {
  return 0;
};

export const GetSize = () => {
  return 0;
};

export const GetNumPoints = () => {
  return 0;
};

export const GetPoint = () => {
  return 0;
};

export const SetPoint = () => {
  return 0;
};

export const SetAllPoints = () => {
  return 0;
};

export const ClearAllPoints = () => {
  return 0;
};

export const CreateAnimationGroup = () => {
  return 0;
};

export const GetAnimationGroups = () => {
  return 0;
};

export const StopAnimating = () => {
  return 0;
};

export const IsDragging = () => {
  return 0;
};

export const IsMouseOver = () => {
  return 0;
};

