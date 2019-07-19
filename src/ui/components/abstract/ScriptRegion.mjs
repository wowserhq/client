import Root from '../Root';
import { multipleClasses } from '../../../utils';

import LayoutFrame from './LayoutFrame';
import ScriptObject from './ScriptObject';

class ScriptRegion extends multipleClasses(ScriptObject, LayoutFrame) {
  constructor(...args) {
    super(...args);

    this._parent = null;
  }

  get protectedFunctionsAllowed() {
    // TODO: Implementation
    return true;
  }

  get parent() {
    return this._parent;
  }

  get layoutParent() {
    if (this.width === 0.0 || !this.parent) {
      return Root.instance;
    }
    return this.parent;
  }

  loadXML(node) {
    LayoutFrame.prototype.loadXML.call(this, node);

    const parentKey = node.attributes.get('parentKey');
    if (parentKey) {
      console.error('TODO: parent key', parentKey, 'for', this);
    }

    // TODO: Load XML animations
  }
}

export default ScriptRegion;
