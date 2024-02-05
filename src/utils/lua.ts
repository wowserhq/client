/* eslint-disable import/prefer-default-export */

import {
  LUA_TBOOLEAN,
  LUA_TFUNCTION,
  LUA_TLIGHTUSERDATA,
  LUA_TNIL,
  LUA_TNONE,
  LUA_TNUMBER,
  LUA_TSTRING,
  LUA_TTABLE,
  LUA_TUSERDATA,
  lua_State,
  lua_gettop,
  lua_toboolean,
  lua_tocfunction,
  lua_tojsstring,
  lua_tonumber,
  lua_touserdata,
  lua_type,
} from '../ui/scripting/lua';

import { stringToBoolean } from '.';

export const luaStackToArray = (L: lua_State) => {
  const top = lua_gettop(L);

  const results = [];
  for (let idx = 1; idx <= top; ++idx) {
    const type = lua_type(L, idx);
    let value;
    switch (lua_type(L, idx)) {
      case LUA_TBOOLEAN:
        value = lua_toboolean(L, idx);
        break;
      case LUA_TFUNCTION:
        value = lua_tocfunction(L, idx);
        if (!value) {
          value = '<lua closure>';
        }
        break;
      case LUA_TLIGHTUSERDATA:
        value = lua_touserdata(L, idx);
        break;
      case LUA_TNIL:
        value = null;
        break;
      case LUA_TNONE:
        value = undefined;
        break;
      case LUA_TNUMBER:
        value = lua_tonumber(L, idx);
        break;
      case LUA_TSTRING:
        value = lua_tojsstring(L, idx);
        break;
      case LUA_TTABLE:
        value = '<table>';
        break;
      case LUA_TUSERDATA:
        value = '<userdata>';
        break;
      default:
        throw new Error(`unknown type in stack: ${type}`);
    }
    results.push(value);
  }
  return results;
};

export const luaValueToBoolean = (L: lua_State, index: number, standard: boolean) => {
  let result;
  switch (lua_type(L, index)) {
    case LUA_TNIL:
      result = false;
      break;
    case LUA_TBOOLEAN:
      result = lua_toboolean(L, index);
      break;
    case LUA_TNUMBER:
      result = lua_tonumber(L, index) !== 0;
      break;
    case LUA_TSTRING: {
      const str = lua_tojsstring(L, index);
      result = stringToBoolean(str, standard);
    } break;
    default:
      result = standard;
      break;
  }
  return result;
};
