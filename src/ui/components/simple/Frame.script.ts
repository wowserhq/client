import EventType from '../../scripting/EventType';
import {
  lua_State,
  lua_isnumber,
  lua_isstring,
  lua_pushnil,
  lua_pushnumber,
  lua_tolstring,
  lua_tonumber,
  luaL_error,
  to_jsstring,
} from '../../scripting/lua';

import Frame from './Frame';

export const GetTitleRegion = () => {
  return 0;
};

export const CreateTitleRegion = () => {
  return 0;
};

export const CreateTexture = () => {
  return 0;
};

export const CreateFontString = () => {
  return 0;
};

export const GetBoundsRect = () => {
  return 0;
};

export const GetNumRegions = () => {
  return 0;
};

export const GetRegions = () => {
  return 0;
};

export const GetNumChildren = () => {
  return 0;
};

export const GetChildren = () => {
  return 0;
};

export const GetFrameStrata = () => {
  return 0;
};

export const SetFrameStrata = () => {
  return 0;
};

export const GetFrameLevel = (L: lua_State): number => {
  const frame = Frame.getObjectFromStack(L);
  lua_pushnumber(L, frame.level);
  return 1;
};

export const SetFrameLevel = (L: lua_State): number => {
  const frame = Frame.getObjectFromStack(L);

  // TODO: Protected logic

  if (!lua_isnumber(L, 2)) {
    return luaL_error(L, 'Usage: %s:SetFrameLevel(level)', frame.displayName);
  }

  const level = lua_tonumber(L, 2);
  if (level < 0) {
    return luaL_error(L, '%s:SetFrameLevel(): Passed negative frame level: %d', frame.displayName, level);
  }

  frame.setFrameLevel(level, true);

  return 0;
};

export const HasScript = () => {
  return 0;
};

export const GetScript = () => {
  return 0;
};

export const SetScript = () => {
  return 0;
};

export const HookScript = () => {
  return 0;
};

export const RegisterEvent = (L: lua_State): number => {
  const frame = Frame.getObjectFromStack(L);

  if (!lua_isstring(L, 2)) {
    return luaL_error(L, 'Usage: %s:RegisterEvent("event")', frame.displayName);
  }

  const event = to_jsstring(lua_tolstring(L, 2, 0));
  frame.registerScriptEvent(event as EventType);
  return 0;
};

export const UnregisterEvent = () => {
  return 0;
};

export const RegisterAllEvents = () => {
  return 0;
};

export const UnregisterAllEvents = () => {
  return 0;
};

export const IsEventRegistered = () => {
  return 0;
};

export const AllowAttributeChanges = () => {
  return 0;
};

export const CanChangeAttribute = () => {
  return 0;
};

export const GetAttribute = () => {
  return 0;
};

export const SetAttribute = () => {
  return 0;
};

export const GetEffectiveScale = () => {
  return 0;
};

export const GetScale = () => {
  return 0;
};

export const SetScale = () => {
  return 0;
};

export const GetEffectiveAlpha = () => {
  return 0;
};

export const GetAlpha = () => {
  return 0;
};

export const SetAlpha = () => {
  return 0;
};

export const GetID = (L: lua_State) => {
  const frame = Frame.getObjectFromStack(L);
  const { id } = frame;
  lua_pushnumber(L, id);
  return 1;
};

export const SetID = (L: lua_State): number => {
  const frame = Frame.getObjectFromStack(L);

  // TODO: Protected logic

  if (!lua_isnumber(L, 2)) {
    return luaL_error(L, 'Usage: %s:SetID(ID)', frame.displayName);
  }

  frame.id = lua_tonumber(L, 2);

  return 0;
};

export const SetToplevel = () => {
  return 0;
};

export const IsToplevel = () => {
  return 0;
};

export const EnableDrawLayer = () => {
  return 0;
};

export const DisableDrawLayer = () => {
  return 0;
};

export const Show = (L: lua_State) => {
  const frame = Frame.getObjectFromStack(L);
  if (frame.protectedFunctionsAllowed) {
    frame.show();
  } else {
    // TODO: Error handling
  }
  return 0;
};

export const Hide = (L: lua_State) => {
  const frame = Frame.getObjectFromStack(L);
  if (frame.protectedFunctionsAllowed) {
    frame.hide();
  } else {
    // TODO: Error handling
  }
  return 0;
};

export const IsVisible = () => {
  return 0;
};

export const IsShown = (L: lua_State) => {
  const frame = Frame.getObjectFromStack(L);
  if (frame.shown) {
    lua_pushnumber(L, 1.0);
  } else {
    lua_pushnil(L);
  }

  return 1;
};

export const Raise = () => {
  return 0;
};

export const Lower = () => {
  return 0;
};

export const GetHitRectInsets = () => {
  return 0;
};

export const SetHitRectInsets = () => {
  return 0;
};

export const GetClampRectInsets = () => {
  return 0;
};

export const SetClampRectInsets = () => {
  return 0;
};

export const GetMinResize = () => {
  return 0;
};

export const SetMinResize = () => {
  return 0;
};

export const GetMaxResize = () => {
  return 0;
};

export const SetMaxResize = () => {
  return 0;
};

export const SetMovable = () => {
  return 0;
};

export const IsMovable = () => {
  return 0;
};

export const SetDontSavePosition = () => {
  return 0;
};

export const GetDontSavePosition = () => {
  return 0;
};

export const SetResizable = () => {
  return 0;
};

export const IsResizable = () => {
  return 0;
};

export const StartMoving = () => {
  return 0;
};

export const StartSizing = () => {
  return 0;
};

export const StopMovingOrSizing = () => {
  return 0;
};

export const SetUserPlaced = () => {
  return 0;
};

export const IsUserPlaced = () => {
  return 0;
};

export const SetClampedToScreen = () => {
  return 0;
};

export const IsClampedToScreen = () => {
  return 0;
};

export const RegisterForDrag = () => {
  return 0;
};

export const EnableKeyboard = () => {
  return 0;
};

export const IsKeyboardEnabled = () => {
  return 0;
};

export const EnableMouse = () => {
  return 0;
};

export const IsMouseEnabled = () => {
  return 0;
};

export const EnableMouseWheel = () => {
  return 0;
};

export const IsMouseWheelEnabled = () => {
  return 0;
};

export const EnableJoystick = () => {
  return 0;
};

export const IsJoystickEnabled = () => {
  return 0;
};

export const GetBackdrop = () => {
  return 0;
};

export const SetBackdrop = () => {
  return 0;
};

export const GetBackdropColor = () => {
  return 0;
};

export const SetBackdropColor = () => {
  return 0;
};

export const GetBackdropBorderColor = () => {
  return 0;
};

export const SetBackdropBorderColor = () => {
  return 0;
};

export const SetDepth = () => {
  return 0;
};

export const GetDepth = () => {
  return 0;
};

export const GetEffectiveDepth = () => {
  return 0;
};

export const IgnoreDepth = () => {
  return 0;
};

export const IsIgnoringDepth = () => {
  return 0;
};
