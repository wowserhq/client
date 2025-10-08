import ScriptingContext from '../ScriptingContext';
import {
  LUA_REGISTRYINDEX,
  LUA_TFUNCTION,
  lua_State,
  lua_type,
  luaL_error,
  luaL_ref,
  luaL_unref,
} from '../lua';

export const setglobal = () => {
  return 0;
};

export const getglobal = () => {
  return 0;
};

export const strtrim = () => {
  return 0;
};

export const strsplit = () => {
  return 0;
};

export const strjoin = () => {
  return 0;
};

export const strreplace = () => {
  return 0;
};

export const strconcat = () => {
  return 0;
};

export const strlenutf8 = () => {
  return 0;
};

export const issecure = () => {
  return 0;
};

export const issecurevariable = () => {
  return 0;
};

export const forceinsecure = () => {
  return 0;
};

export const securecall = () => {
  return 0;
};

export const hooksecurefunc = () => {
  return 0;
};

export const debugload = () => {
  return 0;
};

export const debuginfo = () => {
  return 0;
};

export const debugprint = () => {
  return 0;
};

export const debugdump = () => {
  return 0;
};

export const debugbreak = () => {
  return 0;
};

export const debughook = () => {
  return 0;
};

export const debugtimestamp = () => {
  return 0;
};

export const debugprofilestart = () => {
  return 0;
};

export const debugprofilestop = () => {
  return 0;
};

export const seterrorhandler = (L: lua_State) => {
  if (lua_type(L, 1) !== LUA_TFUNCTION) {
    luaL_error(L, 'Usage: seterrorhandler(errfunc)');
    return 0;
  }

  const scripting = ScriptingContext.instance;
  if (scripting.errorHandlerFunc !== null) {
    luaL_unref(L, LUA_REGISTRYINDEX, scripting.errorHandlerFunc);
  }
  scripting.errorHandlerFunc = luaL_ref(L, LUA_REGISTRYINDEX);
  return 0;
};

export const geterrorhandler = () => {
  return 0;
};

export const date = () => {
  return 0;
};

export const time = () => {
  return 0;
};

export const difftime = () => {
  return 0;
};

export const debugstack = () => {
  return 0;
};

export const debuglocals = () => {
  return 0;
};

export const scrub = () => {
  return 0;
};
