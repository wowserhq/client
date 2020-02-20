import Region from '../Region';

import * as scriptFunctions from './script';

// TODO: Multi inherit from both Region and Fontable
class FontString extends Region {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  postLoadXML(_node) {
    // TODO
  }
}

export default FontString;
