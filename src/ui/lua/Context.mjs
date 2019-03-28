import {
  LUA_REGISTRYINDEX,
  lua_atnativeerror,
  lua_call,
  lua_createtable,
  lua_gc,
  lua_insert,
  lua_isstring,
  lua_isuserdata,
  lua_pcall,
  lua_pushcclosure,
  lua_pushstring,
  lua_rawgeti,
  lua_setglobal,
  lua_settable,
  lua_settop,
  lua_tolstring,
  lua_touserdata,
  luaL_loadbuffer,
  luaL_newstate,
  luaL_openlibs,
  luaL_ref,
  to_jsstring,
  to_luastring,
} from './api';

import bitLua from './vendor/bit.lua';
import compatLua from './vendor/compat.lua';

import * as extraScriptFunctions from './globals/extra';
import * as frameScriptFunctions from './globals/frame';
import * as sharedScriptFunctions from './globals/shared';
import * as systemScriptFunctions from './globals/system';

class LuaContext {
  constructor(client) {
    this.client = client;

    this.errorHandlerFunc = null;
    this.handlingError = 0;

    const L = luaL_newstate();
    this.state = L;
    // TODO: Is this a terrible idea?
    this.state.client = client;

    lua_atnativeerror(L, this.onNativeError);
    lua_pushcclosure(L, this.onError.bind(this), 0);

    this.errorHandlerRef = luaL_ref(L, LUA_REGISTRYINDEX);
    lua_createtable(L, 0, 0);

    this.recursiveTableHash = luaL_ref(L, LUA_REGISTRYINDEX);
    lua_gc(L, 6, 110);

    // TODO: Is this OK, rather than lua_openbase + friends?
    luaL_openlibs(L);
    this.execute(bitLua, 'bit.lua');

    // TODO: Is it legit to load these script functions on boot?
    this.registerFunctions(extraScriptFunctions);
    this.registerFunctions(frameScriptFunctions);
    this.registerFunctions(sharedScriptFunctions);
    this.registerFunctions(systemScriptFunctions);

    this.execute(compatLua, 'compat.lua');
  }

  execute(source, filename = '<inline>') {
    console.info('executing', filename);
    console.info('source: ', source.slice(0, 100));

    // TODO: Overloaded version

    const L = this.state;

    lua_rawgeti(L, LUA_REGISTRYINDEX, this.errorHandlerRef);

    const lsource = to_luastring(source);
    const length = source.length;
    const lfilename = to_luastring(filename);

    if (!luaL_loadbuffer(L, lsource, length, lfilename)) {
      if (lua_pcall(L, 0, 0, -2)) {
        lua_settop(L, -3);
      } else {
        lua_settop(L, -2);
      }
    } else if (lua_pcall(L, 1, 0, 0)) {
      lua_settop(L, -2);
    }

    return true;
  }

  onNativeError() {
    // onError is invoked with the Error object still on the stack
    return 1;
  }

  onError(L) {
    if (lua_isuserdata(L, -1)) {
      const e = lua_touserdata(L, -1);
      console.error(e);
      return 0;
    }

    if (!lua_isstring(L, -1)) {
      lua_pushstring(L, 'UNKNOWN ERROR');
      lua_insert(L, -1);
    }

    const msg = lua_tolstring(L, -1, 0);

    // TODO: Handle current object related errors

    // Invoke the Lua-side error handler (if any)
    if (this.errorHandlerFunc) {
      this.handlingError = 1;

      lua_rawgeti(L, LUA_REGISTRYINDEX, this.errorHandlerFunc);
      lua_insert(L, -2);
      lua_call(L, 1, 1);

      this.handlingError = 0;
    } else {
      console.error(to_jsstring(msg));
    }

    return 1;
  }

  registerFunctions(object) {
    for (const [name, func] of Object.entries(object)) {
      this.registerFunction(name, func);
    }
  }

  registerFunction(name, func) {
    const L = this.state;
    lua_pushcclosure(L, func, 0);
    lua_setglobal(L, name);
  }

  createMetaTable(scriptFunctions = {}) {
    const L = this.state;

    lua_createtable(L, 0, 0);
    lua_pushstring(L, '__index');
    lua_createtable(L, 0, 0);

    for (const [name, func] of Object.entries(scriptFunctions)) {
      lua_pushstring(L, name);
      lua_pushcclosure(L, func, 0);
      lua_settable(L, -3);
    }

    lua_settable(L, -3);
    return luaL_ref(L, LUA_REGISTRYINDEX);
  }
}

export default LuaContext;
