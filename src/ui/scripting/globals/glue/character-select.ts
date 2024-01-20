import { lua_pushnumber } from '../../../scripting/lua';

export const SetCharSelectModelFrame = () => {
  return 0;
};

export const SetCharSelectBackground = () => {
  return 0;
};

export const GetCharacterListUpdate = () => {
  return 0;
};

export const GetNumCharacters = (L) => {
  // TODO: Actually calculate number of characters
  lua_pushnumber(L, 0);
  return 1;
};

export const GetCharacterInfo = () => {
  return 0;
};

export const SelectCharacter = () => {
  return 0;
};

export const DeleteCharacter = () => {
  return 0;
};

export const RenameCharacter = () => {
  return 0;
};

export const DeclineCharacter = () => {
  return 0;
};

export const UpdateSelectionCustomizationScene = () => {
  return 0;
};

export const GetCharacterSelectFacing = () => {
  return 0;
};

export const SetCharacterSelectFacing = () => {
  return 0;
};

export const GetSelectBackgroundModel = () => {
  return 0;
};
