import Frame from '../Frame';

import * as scriptFunctions from './script';

class Slider extends Frame {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  constructor(...args) {
    super(...args);

    this.value = 0.0;
  }
}

export default Slider;
