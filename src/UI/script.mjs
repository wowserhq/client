import {
  LUA_TTABLE,
  lua_isstring,
  lua_tojsstring,
  lua_type,
  luaL_error,
} from '../script/lua';

export const GetText = () => {
  return 1;
};

export const GetNumFrames = () => {
  return 1;
};

export const EnumerateFrames = () => {
  return 1;
};

export const CreateFont = () => {
  return 1;
};

export const CreateFrame = (L) => {
  if (!lua_isstring(L, 1) || (lua_type(L, 3) !== -1 && lua_type(L, 3) && lua_type(L, 3) !== LUA_TTABLE)) {
    luaL_error(L, 'Usage: CreateFrame("frameType" [, "name"] [, parent] [, "template"] [, id])');
    return 0;
  }

  const name = lua_tojsstring(L, 1, 0);
  const template = lua_tojsstring(L, 2, 0);
  const inherits = lua_tojsstring(L, 4, 0);

  console.log('creating a frame', { name, template, inherits });

  // TODO: Rest of CreateFrame implementation

  return 1;
};

export const GetFramesRegisteredForEvent = () => {
  return 1;
};

export const GetCurrentKeyBoardFocus = () => {
  return 1;
};
