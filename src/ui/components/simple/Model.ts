import Frame from './Frame';

import * as scriptFunctions from './Model.script';

class Model extends Frame {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }
}

export default Model;
