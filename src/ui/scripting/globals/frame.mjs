import XMLNode from '../../xml/Node';
import {
  LUA_REGISTRYINDEX,
  LUA_TTABLE,
  lua_isnumber,
  lua_isstring,
  lua_rawgeti,
  lua_tojsstring,
  lua_type,
  luaL_error,
} from '../lua';
import { Status } from '../../../utils/logging';

export const GetText = () => {
  return 0;
};

export const GetNumFrames = () => {
  return 0;
};

export const EnumerateFrames = () => {
  return 0;
};

export const CreateFont = () => {
  return 0;
};

export const CreateFrame = (L) => {
  const type = lua_type(L, 3);
  if (!lua_isstring(L, 1) || (type !== -1 && type && type !== LUA_TTABLE)) {
    luaL_error(L, 'Usage: CreateFrame("frameType" [, "name"] [, parent] [, "template"] [, id])');
    return 0;
  }

  const frameType = lua_tojsstring(L, 1, 0);
  const name = lua_tojsstring(L, 2, 0);
  const parent = lua_tojsstring(L, 3, 0);
  const inherits = lua_tojsstring(L, 4, 0);

  // TODO: Validate parent and inherits

  const node = new XMLNode(null, frameType);
  const { attributes } = node;

  if (name) {
    attributes.set('name', name);
  }

  if (parent) {
    attributes.set('parent', '');
  }

  if (inherits) {
    attributes.set('inherits', inherits);
  }

  if (lua_isstring(L, 5)) {
    const id = lua_tojsstring(L, 5, 0);
    attributes.set('id', id);
  } else if (lua_isnumber(L, 5)) {
    // TODO: Calculate numeric ID properly
    attributes.set('id', Math.random());
  }

  const status = new Status();

  // Create an instance of Frame or a descendant class
  const frame = L.client.ui.createFrame(node, parent, status);
  if (!frame) {
    luaL_error(L, "CreateFrame: Unknown frame type '%s'", frameType);
    return 0;
  }

  // Ensure the instance is registered within the Lua context
  if (!frame.registered) {
    frame.register();
  }

  // Return a reference to the instance
  lua_rawgeti(L, LUA_REGISTRYINDEX, frame.luaRef);

  return 1;
};

export const GetFramesRegisteredForEvent = () => {
  return 0;
};

export const GetCurrentKeyBoardFocus = () => {
  return 0;
};