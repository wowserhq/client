import { lua_pushnumber } from '../../scripting/lua';

import Slider from './Slider';

export const GetThumbTexture = () => {
  return 0;
};

export const SetThumbTexture = () => {
  return 0;
};

export const GetOrientation = () => {
  return 0;
};

export const SetOrientation = () => {
  return 0;
};

export const GetMinMaxValues = () => {
  return 0;
};

export const SetMinMaxValues = () => {
  return 0;
};

export const GetValue = (L) => {
  const slider = Slider.getObjectFromStack(L);
  const { value } = slider;
  lua_pushnumber(L, value);
  return 1;
};

export const SetValue = () => {
  return 0;
};

export const GetValueStep = () => {
  return 0;
};

export const SetValueStep = () => {
  return 0;
};

export const Enable = () => {
  return 0;
};

export const Disable = () => {
  return 0;
};

export const IsEnabled = () => {
  return 0;
};

