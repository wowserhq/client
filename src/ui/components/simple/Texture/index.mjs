import Region from '../Region';

import * as scriptFunctions from './script';

class Texture extends Region {
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

export default Texture;
