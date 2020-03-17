import { lua_pushnumber } from '../../../scripting/lua';

export const SetScrollChild = () => {
  return 0;
};

export const GetScrollChild = () => {
  return 0;
};

export const SetHorizontalScroll = () => {
  return 0;
};

export const SetVerticalScroll = () => {
  return 0;
};

export const GetHorizontalScroll = () => {
  return 0;
};

export const GetVerticalScroll = () => {
  return 0;
};

export const GetHorizontalScrollRange = () => {
  return 0;
};

export const GetVerticalScrollRange = (L) => {
  // TODO: Implementation
  lua_pushnumber(L, 0);
  return 1;
};

export const UpdateScrollChildRect = () => {
  return 0;
};
