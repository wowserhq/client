const objectTypes = new Map();

class ScriptObject {
  static get objectType() {
    let type = objectTypes.get(this);
    if (!type) {
      type = objectTypes.size;
      objectTypes.set(type, this);
    }
    return type;
  }
}

export default ScriptObject;
