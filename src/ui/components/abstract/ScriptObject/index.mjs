import FrameScriptObject from '../../../scripting/FrameScriptObject';

import * as scriptFunctions from './script';

class ScriptObject extends FrameScriptObject {
  static get scriptFunctions() {
    return scriptFunctions;
  }

  constructor() {
    super();

    this._name = null;
  }

  get displayName() {
    return this.name || '<unnamed>';
  }

  get name() {
    return this._name;
  }

  set name(name) {
    if (this._name) {
      this.deregister();
      this._name = null;
    }

    if (name) {
      this._name = this.fullyQualifyName(name);
      this.register(this._name);
    }
  }

  // Fully qualifies given name, replacing $parent (if any) with parent's name
  // Example: <FontString name="$parentCategory" />
  fullyQualifyName(name) {
    const keyword = '$parent';
    if (name.includes(keyword)) {
      let parentName = '';

      let node = this;
      while (node = node.parent) {
        parentName = node.name;
        if (parentName) {
          break;
        }
      }

      const fqname = name.replace(keyword, parentName);
      return fqname;
    }
    return name;
  }

  preLoadXML(node) {
    const name = node.attributes.get('name');

    if (name) {
      this.name = name;
    }
  }
}

export default ScriptObject;
