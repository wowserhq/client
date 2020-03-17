import Button from '../Button';

import * as scriptFunctions from './script';

class CheckBox extends Button {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }
}

export default CheckBox;
