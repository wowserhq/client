import {
  LUA_REGISTRYINDEX,
  LUA_TTABLE,
  lua_Debug,
  lua_Ref,
  lua_State,
  lua_atnativeerror,
  lua_call,
  lua_checkstack,
  lua_createtable,
  lua_gc,
  lua_getglobal,
  lua_getinfo,
  lua_getlocal,
  lua_getstack,
  lua_gettop,
  lua_insert,
  lua_isstring,
  lua_isuserdata,
  lua_pcall,
  lua_pushboolean,
  lua_pushcclosure,
  lua_pushnumber,
  lua_pushstring,
  lua_pushvalue,
  lua_rawgeti,
  lua_replace,
  lua_setglobal,
  lua_settop,
  lua_tolstring,
  lua_touserdata,
  lua_type,
  luaL_loadbuffer,
  luaL_newstate,
  luaL_openlibs,
  luaL_ref,
  to_jsstring,
  to_luastring,
} from './lua';

import bitLua from './vendor/bit.lua?raw'; // eslint-disable-line import/no-unresolved
import compatLua from './vendor/compat.lua?raw'; // eslint-disable-line import/no-unresolved

import EventType from './EventType';
import EventEmitter, { EventListenerNode } from './EventEmitter';
import FrameScriptObject from './FrameScriptObject';

import * as extraScriptFunctions from './globals/extra';
import * as frameScriptFunctions from './globals/frame';
import * as sharedScriptFunctions from './globals/shared';
import * as soundScriptFunctions from './globals/sound';
import * as systemScriptFunctions from './globals/system';

type ScriptFunction = (L: lua_State) => number;

class ScriptingContext {
  static instance: ScriptingContext;

  errorHandlerFunc: lua_Ref | null;
  handlingError: boolean;
  state: lua_State;
  errorHandlerRef: lua_Ref;
  recursiveTableHash: lua_Ref;
  events: Record<EventType, EventEmitter>;

  constructor() {
    ScriptingContext.instance = this;

    this.errorHandlerFunc = null;
    this.handlingError = false;

    const L = luaL_newstate();
    this.state = L;

    lua_atnativeerror(L, this.onNativeError);
    lua_pushcclosure(L, this.onError.bind(this), 0);

    this.errorHandlerRef = luaL_ref(L, LUA_REGISTRYINDEX);
    lua_createtable(L, 0, 0);

    this.recursiveTableHash = luaL_ref(L, LUA_REGISTRYINDEX);
    lua_gc(L, 6, 110);

    this.events = Object.assign({}, ...Object.values(EventType).map((type) => ({
      [type]: new EventEmitter(type)
    })));

    // TODO: Is this OK, rather than lua_openbase + friends?
    luaL_openlibs(L);
    this.execute(bitLua, 'bit.lua');

    // TODO: Is it legit to load these script functions on boot?
    this.registerFunctions(extraScriptFunctions);
    this.registerFunctions(frameScriptFunctions);
    this.registerFunctions(sharedScriptFunctions);
    this.registerFunctions(soundScriptFunctions);
    this.registerFunctions(systemScriptFunctions);

    this.execute(compatLua, 'compat.lua');
  }

  compileFunction(source: string, name = '<unknown>') {
    const L = this.state;

    lua_rawgeti(L, LUA_REGISTRYINDEX, this.errorHandlerRef);

    const lsource = to_luastring(source);
    const length = source.length;
    const lname = to_luastring(name);

    if (luaL_loadbuffer(L, lsource, length, lname)) {
      // TODO: Status handling
      if (lua_pcall(L, 1, 0, 0)) {
        lua_settop(L, -2);
      }
      return -1;
    } else if (lua_pcall(L, 0, 1, -2)) {
      // TODO: Status handling
      lua_settop(L, -3);
      return -1;
    }

    const luaRef = luaL_ref(L, LUA_REGISTRYINDEX);
    lua_settop(L, -2);
    return luaRef;
  }

  execute(source: string, filename = '<inline>') {
    console.groupCollapsed('executing', filename);
    console.log(source.slice(0, 500));

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

    console.groupEnd();

    return true;
  }

  executeFunction(functionRef: lua_Ref, thisArg: FrameScriptObject, givenArgsCount: number, _unk?: unknown, event?: EventEmitter) {
    const L = this.state;

    const stackBase = 1 - givenArgsCount + lua_gettop(L);
    let argsCount = givenArgsCount;

    lua_checkstack(L, givenArgsCount + 2);

    if (thisArg) {
      lua_getglobal(L, 'this');

      if (!thisArg.isLuaRegistered) {
        thisArg.register();
      }

      lua_rawgeti(L, LUA_REGISTRYINDEX, thisArg.luaRef!);
      lua_setglobal(L, 'this');
    }

    if (event) {
      lua_getglobal(L, 'event');
      lua_pushvalue(L, stackBase);
      lua_setglobal(L, 'event');
    }

    const firstArg = event ? 1 : 0;
    let globalArgId = 0;
    if (firstArg < givenArgsCount) {
      for (let i = firstArg; i < givenArgsCount; ++i) {
        globalArgId++;
        const argName = `arg${globalArgId}`;
        lua_getglobal(L, argName);
        lua_pushvalue(L, stackBase + firstArg);
        lua_setglobal(L, argName);
      }
    }

    lua_checkstack(L, givenArgsCount + 3);

    lua_rawgeti(L, LUA_REGISTRYINDEX, this.errorHandlerRef);
    lua_rawgeti(L, LUA_REGISTRYINDEX, functionRef);

    if (thisArg) {
      if (!thisArg.isLuaRegistered) {
        thisArg.register();
      }

      lua_rawgeti(L, LUA_REGISTRYINDEX, thisArg.luaRef!);
      argsCount++;
    }

    for (let i = 0; i < givenArgsCount; ++i) {
      lua_pushvalue(L, stackBase + i);
    }

    if (lua_pcall(L, argsCount, 0, -2 - argsCount)) {
      lua_settop(L, -2);
    }

    lua_settop(L, -2);

    for (let i = globalArgId; i > 0; --i) {
      const argName = `arg${globalArgId}`;
      lua_setglobal(L, argName);
    }

    if (event) {
      lua_setglobal(L, 'event');
  }

    if (thisArg) {
      lua_setglobal(L, 'this');
    }

    lua_settop(L, -1 - givenArgsCount);
  }

  getObjectByName(name: string) {
    const L = this.state;

    lua_getglobal(L, name);

    if (lua_type(L, -1) === LUA_TTABLE) {
      lua_rawgeti(L, -1, 0);
      const object = lua_touserdata(L, -1);
      lua_settop(L, -3);
      return object;
    } else {
      lua_settop(L, -2);
    }
    return null;
  }

  getObjectAt(index: number) {
    const L = this.state;

    const info = new lua_Debug();
    if (!lua_getstack(L, index, info)) {
      return null;
    }

    lua_getinfo(L, 'Sln', info);

    const source = to_jsstring(info.source);
    const calltype = to_jsstring(info.namewhat);

    if (source[0] !== '*' && calltype !== 'method') {
      return null;
    }

    if (!lua_getlocal(L, info, 1)) {
      return null;
    }

    let object = null;
    if (lua_type(L, -1) === LUA_TTABLE) {
      lua_rawgeti(L, -1, 0);
      object = lua_touserdata(L, -1);
      lua_settop(L, -2);
    }

    lua_settop(L, -2);

    return object;
  }

  onNativeError() {
    // onError is invoked with the Error object still on the stack
    return 1;
  }

  onError(L: lua_State) {
    if (lua_isuserdata(L, -1)) {
      const e = lua_touserdata(L, -1);
      console.error(e);
      return 0;
    }

    if (!lua_isstring(L, -1)) {
      lua_pushstring(L, 'UNKNOWN ERROR');
      lua_insert(L, -1);
    }

    let msg = to_jsstring(lua_tolstring(L, -1, 0));

    const object = this.getObjectAt(1);
    if (object) {
      const name = object.name || '<unnamed>';
      // TODO: Is this correctly implemented?
      msg = msg.replace('*', name);
      lua_pushstring(L, msg);
      lua_replace(L, -2);
    }

    // Invoke the Lua-side error handler (if any)
    if (this.errorHandlerFunc) {
      this.handlingError = true;

      lua_rawgeti(L, LUA_REGISTRYINDEX, this.errorHandlerFunc);
      lua_insert(L, -2);
      lua_call(L, 1, 1);

      this.handlingError = false;
    } else {
      console.error(msg);
    }

    return 1;
  }

  registerFunctions(object: Record<string, ScriptFunction>) {
    for (const [name, func] of Object.entries(object)) {
      this.registerFunction(name, func);
    }
  }

  registerFunction(name: string, func: ScriptFunction) {
    const L = this.state;
    lua_pushcclosure(L, func, 0);
    lua_setglobal(L, name);
  }

  registerScriptEvent(object: FrameScriptObject, event: EventEmitter) {
    if (event.pendingSignalCount) {
      let node = event.registerListeners.find((node) => node.listener === object);
      if (node) {
        return;
      }

      node = new EventListenerNode(object);
      event.registerListeners.add(node);
    } else {
      const node = new EventListenerNode(object);
      event.listeners.add(node);
    }
  }

  signalEvent(type: EventType, format?: string, ...args: Array<string | number | boolean>) {
    const L = this.state;

    const event = this.events[type];
    if (!event) {
      return;
    }

    let argsCount = 1;
    lua_pushstring(L, event.type);

    if (format) {
      for (const char of format) {
        switch (char) {
          case 'b':
            lua_pushboolean(L, args[argsCount++ - 1] as boolean);
            break;

          case 'd':
            lua_pushnumber(L, args[argsCount++ - 1] as number);
            break;

          case 'f':
            lua_pushnumber(L, args[argsCount++ - 1] as number);
            break;

          case 's':
            lua_pushstring(L, args[argsCount++ - 1] as string);
            break;

          case 'u':
            lua_pushnumber(L, args[argsCount++ - 1] as number);
            break;
        }
      }
    }

    event.signalCount++;
    event.pendingSignalCount++;

    lua_checkstack(L, argsCount);

    for (const node of event.listeners) {
      const unregisterNode = event.unregisterListeners.find((inner) => inner.listener === node.listener);
      if (unregisterNode) {
        break;
      }

      const script = node.listener.scripts.get('OnEvent');
      if (script?.isLuaRegistered) {
        for (let i = 0; i < argsCount; ++i) {
          lua_pushvalue(L, -argsCount);
        }

        this.executeFunction(script.luaRef!, node.listener, argsCount, null, event);
      }
    }

    event.pendingSignalCount--;

    // TODO: Unregister listeners
    // TODO: Register listeners
  }
}

export default ScriptingContext;
export { type ScriptFunction };
