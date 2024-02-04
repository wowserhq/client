import Frame from './Frame';
import Script from '../../scripting/Script';

import * as scriptFunctions from './Slider.script';

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

    this.scripts.register(
      new Script('OnValueChanged', ['value']),
      new Script('OnMinMaxChanged', ['min', 'max']),
    );
  }
}

export default Slider;
