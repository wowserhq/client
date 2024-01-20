import ScriptingContext from './ScriptingContext';
import Script from './Script';
import ScriptRegistry from './ScriptRegistry';
import {
  LUA_REGISTRYINDEX,
  LUA_TTABLE,
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
  lua_touserdata,
  lua_type,
  luaL_error,
  luaL_ref,
} from './lua';

const scriptMetaTables = new Map();
const objectTypes = new Map();

class FrameScriptObject {
  constructor() {
    this.luaRef = null;

    this.scripts = new ScriptRegistry();
    this.scripts.register(
      new Script('OnEvent', ['event', '...']),
    );
  }

  get isLuaRegistered() {
    return this.luaRef !== null;
  }

  register(name = null) {
    const L = ScriptingContext.instance.state;

    if (!this.isLuaRegistered) {
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
    // TODO: This needs to be moved to the caller
    const script = this.scripts.get(name);
    if (script && script.luaRef) {
      // TODO: Pass in remaining arguments
      ScriptingContext.instance.executeFunction(script.luaRef, this, argsCount);
    }
  }

  static getObjectByName(name, type = this) {
    const object = ScriptingContext.instance.getObjectByName(name);
    if (object && object instanceof type) {
      return object;
    }
    return null;
  }

  static getObjectFromStack(L) {
    if (lua_type(L, 1) !== LUA_TTABLE) {
      luaL_error(L, "Attempt to find 'this' in non-table object (used '.' instead of ':' ?)");
      return null;
    }

    lua_rawgeti(L, 1, 0);
    const object = lua_touserdata(L, -1);
    lua_settop(L, -2);

    if (!object) {
      luaL_error(L, "Attempt to find 'this' in non-framescript object");
      return null;
    }

    // TODO: Will this work in all scenarios?
    if (!(object instanceof this)) {
      luaL_error(L, 'Wrong object type for member function');
      return null;
    }

    return object;
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
