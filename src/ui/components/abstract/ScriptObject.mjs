import BaseScriptObject from '../../lua/ScriptObject';

class ScriptObject extends BaseScriptObject {
  constructor() {
    super();

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

  fullyQualifyName(name) {
    // TODO: Handle $parent references
    return name;
  }
}

export default ScriptObject;
