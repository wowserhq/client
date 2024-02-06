import XMLNode from '../../ui/XMLNode';

import ScriptingContext from './ScriptingContext';
import {
  LUA_REGISTRYINDEX,
  lua_Ref,
  lua_getglobal,
  lua_rawgeti,
  luaL_ref,
  luaL_unref,
} from './lua';

class Script {
  name: string;
  args: string[];
  luaRef: lua_Ref | null;
  source: string | null;

  constructor(name: string, args: string[] = []) {
    this.name = name;
    this.args = ['self', ...args];
    this.luaRef = null;
    this.source = null;
  }

  get wrapper() {
    return `return function(${this.args.join(', ')})\n$body\nend`;
  }

  // Activates script using given node
  // TODO: Handle status
  loadXML(node: XMLNode) {
    const { body } = node;

    const scripting = ScriptingContext.instance;
    const L = scripting.state;

    if (this.luaRef) {
      luaL_unref(L, LUA_REGISTRYINDEX, this.luaRef);
      this.luaRef = null;
    }

    if (!node.scriptLuaRef && body) {
      this.source = this.wrapper.replace('$body', body);

      const scriptName = `*:${this.name}`;
      node.scriptLuaRef = scripting.compileFunction(this.source, scriptName);
    }

    // Direct global function reference
    const functionName = node.attributes.get('function');
    if (functionName) {
      lua_getglobal(L, functionName);

      const luaRef = luaL_ref(L, LUA_REGISTRYINDEX);
      if (luaRef === -1) {
        // TODO: Error handling
      } else {
        this.luaRef = luaRef;
      }

    // Script body reference (e.g. <OnLoad>foo();</OnLoad>)
    // Note: Registered on XML node to allow sharing between template frames
    } else if (node.scriptLuaRef) {
      lua_rawgeti(L, LUA_REGISTRYINDEX, node.scriptLuaRef);
      this.luaRef = luaL_ref(L, LUA_REGISTRYINDEX);
    }
  }
}

export default Script;
