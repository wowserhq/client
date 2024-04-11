import Frame from '../simple/Frame';
import FrameScriptObject from '../../scripting/FrameScriptObject';
import XMLNode from '../../XMLNode';

import * as scriptFunctions from './ScriptObject.script';

class ScriptObject extends FrameScriptObject {
  static get scriptFunctions() {
    return scriptFunctions;
  }

  _name: string | null;

  constructor(..._args: unknown[]) {
    super(..._args);

    this._name = null;
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

  get parent(): Frame | null {
    return null;
  }

  // Fully qualifies given name, replacing $parent (if any) with parent's name
  // Example: <FontString name="$parentCategory" />
  fullyQualifyName(name: string) {
    const keyword = '$parent';
    if (name.includes(keyword)) {
      let parentName: string | null = '';

      let node: ScriptObject | null = this;
      while (node = node.parent) {
        parentName = node.name;
        if (parentName) {
          break;
        }
      }

      const fqname: string = name.replace(keyword, parentName || '');
      return fqname;
    }
    return name;
  }

  preLoadXML(node: XMLNode) {
    const name = node.attributes.get('name');

    if (name) {
      this.name = name;
    }
  }
}

export default ScriptObject;
