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

  value: number;

  constructor(parent: Frame | null) {
    super(parent);

    this.value = 0.0;

    this.scripts.register(
      new Script('OnValueChanged', ['value']),
      new Script('OnMinMaxChanged', ['min', 'max']),
    );
  }
}

export default Slider;
