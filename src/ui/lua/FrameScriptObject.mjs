import {
  LUA_REGISTRYINDEX,
  lua_createtable,
  lua_getglobal,
  lua_pushlightuserdata,
  lua_pushnumber,
  lua_rawgeti,
  lua_rawset,
  lua_setglobal,
  lua_setmetatable,
  lua_settop,
  lua_type,
  luaL_ref,
} from './api';

const metaTables = new Map();
const objectTypes = new Map();

class FrameScriptObject {
  constructor(ui) {
    this.ui = ui;

    this.luaRegistered = 0;
    this.luaRef = null;
  }

  register(name) {
    const L = this.ui.lua.state;

    if (!this.luaRegistered) {
      // TODO: Tainted code handling

      lua_createtable(L, 0, 0);
      lua_pushnumber(L, 0.0);
      lua_pushlightuserdata(L, this);
      lua_rawset(L, -3);

      const ref = this.constructor.getMetaTable(L);
      lua_rawgeti(L, LUA_REGISTRYINDEX, ref);
      lua_setmetatable(L, -2);

      this.luaRef = luaL_ref(L, LUA_REGISTRYINDEX);
    }

    ++this.luaRegistered;

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

  static getMetaTable(L) {
    let metaTable = metaTables.get(this);
    if (!metaTable) {
      metaTable = L.client.ui.lua.createMetaTable(this.scriptFunctions);
      metaTables.set(this, metaTable);
    }
    return metaTable;
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
