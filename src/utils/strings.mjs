/* eslint-disable import/prefer-default-export */

export const stringToBoolean = (string, standard = false) => {
  if (!string) {
    return standard;
  }

  const istring = string.toLowerCase();
  switch (istring[0]) {
    case '0':
    case 'f':
    case 'n':
      return false;

    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case 't':
    case 'y':
      return true;

    default:
      if (istring === 'off' || istring === 'disabled') {
        return false;
      }

      if (istring === 'on' || istring === 'enabled') {
        return true;
      }

      return standard;
  }
};
