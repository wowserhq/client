import Script from '../../scripting/Script';
import UIContext from '../../UIContext';
import XMLNode from '../../XMLNode';
import { Status } from '../../../utils';

import Frame from './Frame';

import * as scriptFunctions from './ScrollFrame.script';

class ScrollFrame extends Frame {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  scrollChild: Frame | null;

  constructor(parent: Frame | null) {
    super(parent);

    this.scrollChild = null;

    this.scripts.register(
      new Script('OnHorizontalScroll', ['offset']),
      new Script('OnVerticalScroll', ['offset']),
      new Script('OnScrollRangeChanged', ['xrange', 'yrange']),
    );
  }

  loadXML(node: XMLNode, status: Status) {
    super.loadXML(node, status);

    const scrollChild = node.getChildByName('ScrollChild');
    if (scrollChild) {
      const child = scrollChild.firstChild;
      if (child) {
        const frame = UIContext.instance.createFrame(child, this, status);
        if (frame) {
          this.scrollChild = frame;
        }
      } else {
        const name = this.name || '<unnamed>';
        status.warning(`frame ${name}: scroll frame created without scroll child`);
      }
    }
  }
}

export default ScrollFrame;
