import UIRoot from '../UIRoot';
import { stringToFramePointType } from '../../utils';
import {
  DDCtoNDCWidth,
  NDCtoDDCWidth,
  aspectCompensation,
  luaValueToBoolean,
  maxAspectCompensation,
} from '../../../utils';
import {
  LUA_TNIL,
  LUA_TSTRING,
  LUA_TTABLE,
  luaL_error,
  lua_State,
  lua_isnumber,
  lua_isstring,
  lua_pushnumber,
  lua_rawgeti,
  lua_settop,
  lua_tolstring,
  lua_tonumber,
  lua_touserdata,
  lua_type,
  to_jsstring,
} from '../../scripting/lua';

import LayoutFrame from './LayoutFrame';
import ScriptRegion from './ScriptRegion';
import FramePointType from './FramePointType';

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

export const GetWidth = (L: lua_State) => {
  const region = ScriptRegion.getObjectFromStack(L);
  let { width } = region;

  if (width === 0.0 && !luaValueToBoolean(L, 2, false)) {
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

export const SetWidth = (L: lua_State) => {
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

export const GetHeight = (L: lua_State) => {
  const region = ScriptRegion.getObjectFromStack(L);
  let { height } = region;

  if (height === 0.0 && !luaValueToBoolean(L, 2, false)) {
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

export const SetHeight = (L: lua_State) => {
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

export const SetPoint = (L: lua_State): number => {
  const region = ScriptRegion.getObjectFromStack(L);

  // TODO: Protection logic

  if (!lua_isstring(L, 2)) {
    return luaL_error(L, 'Usage: %s:SetPoint("point" [, region or nil] [, "relativePoint"] [, offsetX, offsetY])', region.displayName);
  }

  let relative: LayoutFrame | null = region.layoutParent;

  const pointStr = to_jsstring(lua_tolstring(L, 2, 0));
  const point = stringToFramePointType(pointStr);
  if (point === undefined) {
    return luaL_error(L, '%s:SetPoint(): Unknown region point (%s)', region.displayName, pointStr);
  }

  let argsIndex = 3;
  if (lua_type(L, 3) == LUA_TSTRING) {
    const name = to_jsstring(lua_tolstring(L, 3, 0));
    relative = region.getLayoutFrameByName(name);

    argsIndex++;
  } else if (lua_type(L, 3) == LUA_TTABLE) {
    lua_rawgeti(L, 3, 0);

    relative = lua_touserdata(L, -1) as LayoutFrame ?? null;

    lua_settop(L, -2);

    argsIndex++;
  } else if (lua_type(L, 3) == LUA_TNIL) {
    relative = UIRoot.instance;

    argsIndex++;
  }

  if (!relative) {
    const name = lua_tolstring(L, 3, 0);
    return luaL_error(L, "%s:SetPoint(): Couldn't find region named '%s'", region.displayName, name);
  }

  if (relative == region) {
    return luaL_error(L, '%s:SetPoint(): trying to anchor to itself', region.displayName);
  }

  if (relative.isResizeDependency(region)) {
    return luaL_error(L, '%s:SetPoint(): %s is dependent on this', region.displayName, (relative as ScriptRegion).displayName);
  }

  let relativePoint: FramePointType | undefined = point;

  if (lua_type(L, argsIndex) == LUA_TSTRING) {
    const relativePointStr = to_jsstring(lua_tolstring(L, argsIndex, 0));
    relativePoint = stringToFramePointType(relativePointStr);
    if (relativePoint === undefined) {
      return luaL_error(L, '%s:SetPoint(): Unknown region point', region.displayName);
    }

    argsIndex++;
  }

  let offsetX = 0.0;
  let offsetY = 0.0;

  if (lua_isnumber(L, argsIndex) && lua_isnumber(L, argsIndex + 1)) {
    const x = lua_tonumber(L, argsIndex);
    const ndcX = x / (aspectCompensation * 1024.0);
    const ddcX = NDCtoDDCWidth(ndcX);

    const y = lua_tonumber(L, argsIndex + 1);
    const ndcY = y / (aspectCompensation * 1024.0);
    const ddcY = NDCtoDDCWidth(ndcY);

    offsetX = ddcX;
    offsetY = ddcY;
  }

  region.setPoint(point, relative, relativePoint, offsetX, offsetY, true);

  return 0;
};

export const SetAllPoints = (L: lua_State): number => {
  const region = ScriptRegion.getObjectFromStack(L);

  // TODO: Protected logic

  let relative: LayoutFrame | null = region.layoutParent;

  if (lua_isstring(L, 2)) {
    const name = to_jsstring(lua_tolstring(L, 2, 0));
    relative = region.getLayoutFrameByName(name);
  } else if (lua_type(L, 2) == LUA_TTABLE) {
    lua_rawgeti(L, 2, 0);

    relative = lua_touserdata(L, -1) as LayoutFrame ?? null;

    lua_settop(L, -2);
  } else if (lua_type(L, 2) == LUA_TNIL) {
    relative = UIRoot.instance;
  }

  if (!relative) {
    const name = lua_tolstring(L, 2, 0);
    return luaL_error(L, "%s:SetAllPoints(): Couldn't find region named '%s'", region.displayName, name);
  }

  if (relative == region) {
    return luaL_error(L, '%s:SetAllPoints(): trying to anchor to itself', region.displayName);
  }

  if (relative.isResizeDependency(region)) {
    return luaL_error(L, '%s:SetAllPoints(): %s is dependent on this', region.displayName, (relative as ScriptRegion).displayName);
  }

  region.setAllPoints(relative, true);

  return 0;
};

export const ClearAllPoints = (L: lua_State): number => {
  const region = ScriptRegion.getObjectFromStack(L);

  if (region.protectedFunctionsAllowed) {
    region.clearAllPoints();
  } else {
    // TODO: Error handling
  }

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

