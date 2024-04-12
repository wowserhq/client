import { lua_State } from '../../scripting/lua';

import Texture from './Texture';

export const IsObjectType = () => {
  return 0;
};

export const GetObjectType = () => {
  return 0;
};

export const GetDrawLayer = () => {
  return 0;
};

export const SetDrawLayer = () => {
  return 0;
};

export const GetBlendMode = () => {
  return 0;
};

export const SetBlendMode = () => {
  return 0;
};

export const GetVertexColor = () => {
  return 0;
};

export const SetVertexColor = () => {
  return 0;
};

export const SetGradient = () => {
  return 0;
};

export const SetGradientAlpha = () => {
  return 0;
};

export const SetAlpha = () => {
  return 0;
};

export const GetAlpha = () => {
  return 0;
};

export const Show = (L: lua_State): number => {
  const texture = Texture.getObjectFromStack(L);
  texture.show();
  return 0;
};

export const Hide = (L: lua_State): number => {
  const texture = Texture.getObjectFromStack(L);
  texture.hide();
  return 0;
};

export const IsVisible = () => {
  return 0;
};

export const IsShown = () => {
  return 0;
};

export const GetTexture = () => {
  return 0;
};

export const SetTexture = () => {
  return 0;
};

export const GetTexCoord = () => {
  return 0;
};

export const SetTexCoord = () => {
  return 0;
};

export const SetRotation = () => {
  return 0;
};

export const SetDesaturated = () => {
  return 0;
};

export const IsDesaturated = () => {
  return 0;
};

export const SetNonBlocking = () => {
  return 0;
};

export const GetNonBlocking = () => {
  return 0;
};

export const SetHorizTile = () => {
  return 0;
};

export const GetHorizTile = () => {
  return 0;
};

export const SetVertTile = () => {
  return 0;
};

export const GetVertTile = () => {
  return 0;
};
