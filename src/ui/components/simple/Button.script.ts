import {
  DDCtoNDCWidth,
  maxAspectCompensation,
} from '../../../utils';
import {
  LUA_REGISTRYINDEX,
  lua_State,
  lua_pushnil,
  lua_pushnumber,
  lua_rawgeti,
} from '../../scripting/lua';

import Button from './Button';

export const Enable = (L: lua_State) => {
  const button = Button.getObjectFromStack(L);

  if (button.protectedFunctionsAllowed) {
    button.enable(true);
  } else {
    // TODO: Disallowed logic
  }

  return 0;
};

export const Disable = (L: lua_State) => {
  const button = Button.getObjectFromStack(L);

  if (button.protectedFunctionsAllowed) {
    button.enable(false);
  } else {
    // TODO: Disallowed logic
  }

  return 0;
};

export const IsEnabled = () => {
  return 0;
};

export const GetButtonState = () => {
  return 0;
};

export const SetButtonState = () => {
  return 0;
};

export const SetNormalFontObject = () => {
  return 0;
};

export const GetNormalFontObject = () => {
  return 0;
};

export const SetDisabledFontObject = () => {
  return 0;
};

export const GetDisabledFontObject = () => {
  return 0;
};

export const SetHighlightFontObject = () => {
  return 0;
};

export const GetHighlightFontObject = () => {
  return 0;
};

export const SetFontString = () => {
  return 0;
};

export const GetFontString = () => {
  return 0;
};

export const SetText = () => {
  return 0;
};

export const SetFormattedText = () => {
  return 0;
};

export const GetText = () => {
  return 0;
};

export const SetNormalTexture = () => {
  return 0;
};

export const GetNormalTexture = () => {
  return 0;
};

export const SetPushedTexture = () => {
  return 0;
};

export const GetPushedTexture = () => {
  return 0;
};

export const SetDisabledTexture = () => {
  return 0;
};

export const GetDisabledTexture = () => {
  return 0;
};

export const SetHighlightTexture = () => {
  return 0;
};

export const GetHighlightTexture = (L: lua_State) => {
  const button = Button.getObjectFromStack(L);
  const texture = button.highlightTexture;

  if (texture) {
    if (!texture.isLuaRegistered) {
      texture.register();
    }

    lua_rawgeti(L, LUA_REGISTRYINDEX, texture.luaRef!);
  } else {
    lua_pushnil(L);
  }

  return 1;
};

export const SetPushedTextOffset = () => {
  return 0;
};

export const GetPushedTextOffset = () => {
  return 0;
};

export const GetTextWidth = (L: lua_State) => {
  const button = Button.getObjectFromStack(L);
  const { fontString } = button;

  const width = fontString ? fontString.width : 0.0;
  const ddcx = maxAspectCompensation * width;
  const ndcx = DDCtoNDCWidth(ddcx);
  lua_pushnumber(L, ndcx);
  return 1;
};

export const GetTextHeight = () => {
  return 0;
};

export const RegisterForClicks = () => {
  return 0;
};

export const Click = () => {
  return 0;
};

export const LockHighlight = () => {
  return 0;
};

export const UnlockHighlight = () => {
  return 0;
};

export const GetMotionScriptsWhileDisabled = () => {
  return 0;
};

export const SetMotionScriptsWhileDisabled = () => {
  return 0;
};
