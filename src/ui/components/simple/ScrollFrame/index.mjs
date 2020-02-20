import Frame from '../Frame';
import Script from '../../../scripting/Script';

import * as scriptFunctions from './script';

class ScrollFrame extends Frame {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  constructor(...args) {
    super(...args);

    this.scripts.register(
      new Script('OnHorizontalScroll', ['offset']),
      new Script('OnVerticalScroll', ['offset']),
      new Script('OnScrollRangeChanged', ['xrange', 'yrange']),
    );
  }
}

export default ScrollFrame;
