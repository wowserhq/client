import Frame from '../Frame';

import * as scriptFunctions from './script';

class Model extends Frame {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }
}

export default Model;
