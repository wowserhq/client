import Frame from '../simple/Frame';
import UIRoot from '../UIRoot';
import XMLNode from '../../XMLNode';
import { Status, multipleClasses } from '../../../utils';

import LayoutFrame from './LayoutFrame';
import ScriptObject from './ScriptObject';

import * as scriptFunctions from './ScriptRegion.script';

class ScriptRegion extends multipleClasses(ScriptObject, LayoutFrame) {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  _parent: Frame | null;

  constructor(..._args: unknown[]) {
    super(_args);

    this._parent = null;
  }

  get protectedFunctionsAllowed() {
    // TODO: Implementation
    return true;
  }

  get parent() {
    return this._parent;
  }

  get layoutParent(): LayoutFrame {
    if (this.width === 0.0 || !this.parent) {
      return UIRoot.instance;
    }
    return this.parent;
  }

  loadXML(node: XMLNode, status: Status) {
    super.loadXML(node, status);

    const parentKey = node.attributes.get('parentKey');
    if (parentKey) {
      console.error('TODO: parent key', parentKey, 'for', this);
    }

    // TODO: Load XML animations
  }
}

export default ScriptRegion;
