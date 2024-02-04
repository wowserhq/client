import Frame from './Frame';
import Script from '../../scripting/Script';
import UIContext from '../../UIContext';

import * as scriptFunctions from './ScrollFrame.script';

class ScrollFrame extends Frame {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  constructor(...args) {
    super(...args);

    this.scrollChild = null;

    this.scripts.register(
      new Script('OnHorizontalScroll', ['offset']),
      new Script('OnVerticalScroll', ['offset']),
      new Script('OnScrollRangeChanged', ['xrange', 'yrange']),
    );
  }

  loadXML(node) {
    super.loadXML(node);

    const scrollChild = node.getChildByName('ScrollChild');
    if (scrollChild) {
      const child = scrollChild.firstChild;
      if (child) {
        const frame = UIContext.instance.createFrame(child, this);
        if (frame) {
          this.scrollChild = frame;
        }
      } else {
        // TODO: Error handling
        console.warn('scroll frame created without child');
      }
    }
  }
}

export default ScrollFrame;
