import ScriptingContext from './Context';
import ScriptRegistry from './Script/Registry';

import {
  LUA_REGISTRYINDEX,
  lua_createtable,
  lua_getglobal,
  lua_pushcclosure,
  lua_pushlightuserdata,
  lua_pushnumber,
  lua_pushstring,
  lua_rawgeti,
  lua_rawset,
  lua_setglobal,
  lua_setmetatable,
  lua_settable,
  lua_settop,
  lua_type,
  luaL_ref,
} from './lua';

const scriptMetaTables = new Map();
const objectTypes = new Map();

class FrameScriptObject {
  constructor() {
    this.luaRef = null;

    this.scripts = new ScriptRegistry();
  }

  get luaRegistered() {
    return this.luaRef !== null;
  }

  register(name = null) {
    const L = ScriptingContext.instance.state;

    if (!this.luaRegistered) {
      // TODO: Tainted code handling

      lua_createtable(L, 0, 0);
      lua_pushnumber(L, 0.0);
      lua_pushlightuserdata(L, this);
      lua_rawset(L, -3);

      const ref = this.constructor.scriptMetaTable;
      lua_rawgeti(L, LUA_REGISTRYINDEX, ref);
      lua_setmetatable(L, -2);

      this.luaRef = luaL_ref(L, LUA_REGISTRYINDEX);
    }

    if (name) {
      lua_getglobal(L, name);

      const found = lua_type(L, -1);
      lua_settop(L, -2);

      if (!found) {
        lua_rawgeti(L, LUA_REGISTRYINDEX, this.luaRef);
        lua_setglobal(L, name);
      }
    }
  }

  deregister() {
    // TODO: Unregister
  }

  runScript(name, argsCount = 0) {
    const script = this.scripts.get(name);
    if (script && script.luaRef) {
      // TODO: Pass in remaining arguments
      ScriptingContext.instance.executeFunction(script.luaRef, this, argsCount);
    }
  }

  static get scriptFunctions() {
    return {};
  }

  static get scriptMetaTable() {
    let scriptMetaTable = scriptMetaTables.get(this);
    if (!scriptMetaTable) {
      const L = ScriptingContext.instance.state;

      lua_createtable(L, 0, 0);
      lua_pushstring(L, '__index');
      lua_createtable(L, 0, 0);

      for (const [name, func] of Object.entries(this.scriptFunctions)) {
        lua_pushstring(L, name);
        lua_pushcclosure(L, func, 0);
        lua_settable(L, -3);
      }

      lua_settable(L, -3);

      scriptMetaTable = luaL_ref(L, LUA_REGISTRYINDEX);
      scriptMetaTables.set(this, scriptMetaTable);
    }
    return scriptMetaTable;
  }

  static get objectType() {
    let type = objectTypes.get(this);
    if (!type) {
      type = objectTypes.size;
      objectTypes.set(type, this);
    }
    return type;
  }
}

export default FrameScriptObject;
