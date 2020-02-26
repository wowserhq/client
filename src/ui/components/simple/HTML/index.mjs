import Frame from '../Frame';

import * as scriptFunctions from './script';

class HTML extends Frame {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }
}

export default HTML;
