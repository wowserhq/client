import {
  DDCtoNDCWidth,
  NDCtoDDCWidth,
  luaValueToBoolean,
  maxAspectCompensation,
} from '../../../../utils';
import {
  luaL_error,
  lua_isnumber,
  lua_pushnumber,
  lua_tonumber,
} from '../../../scripting/lua';

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
  let { width } = region;

  if (width === 0.0 && !luaValueToBoolean(L, 2, 0)) {
    if (region.isResizePending) {
      region.resize(true);
    }

    const rect = region.getRect();
    if (rect) {
      width = (rect.maxX - rect.minX) / region.layoutScale;
    }
  }

  const ddcx = maxAspectCompensation * width;
  const ndcx = DDCtoNDCWidth(ddcx);
  lua_pushnumber(L, ndcx);
  return 1;
};

export const SetWidth = (L) => {
  const region = ScriptRegion.getObjectFromStack(L);

  // TODO: Protected logic

  if (!lua_isnumber(L, 2)) {
    return luaL_error(L, 'Usage: %s:SetWidth(width)', region.displayName);
  }

  const width = lua_tonumber(L, 2);
  const ndcWidth = width / maxAspectCompensation;
  const ddcWidth = NDCtoDDCWidth(ndcWidth);

  region.width = ddcWidth;

  return 0;
};

export const GetHeight = (L) => {
  const region = ScriptRegion.getObjectFromStack(L);
  let { height } = region;

  if (height === 0.0 && !luaValueToBoolean(L, 2, 0)) {
    if (region.isResizePending) {
      region.resize(true);
    }

    const rect = region.getRect();
    if (rect) {
      height = (rect.maxY - rect.minY) / region.layoutScale;
    }
  }

  const ddcy = maxAspectCompensation * height;
  const ndcy = DDCtoNDCWidth(ddcy);
  lua_pushnumber(L, ndcy);
  return 1;
};

export const SetHeight = (L) => {
  const region = ScriptRegion.getObjectFromStack(L);

  // TOOD: Protected logic

  if (!lua_isnumber(L, 2)) {
    return luaL_error(L, 'Usage: %s:SetHeight(height)', region.displayName);
  }

  const height = lua_tonumber(L, 2);
  const ndcHeight = height / maxAspectCompensation;
  const ddcHeight = NDCtoDDCWidth(ndcHeight);

  region.height = ddcHeight;

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

