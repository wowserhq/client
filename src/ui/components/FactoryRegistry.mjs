import * as frameTypes from '.';

const DEFAULTS = [
  'Button',
  'EditBox',
  'Frame',
];

class FactoryNode {
  constructor(name, ctor, unique = false) {
    this.name = name;
    this.ctor = ctor;
    this.unique = unique;
  }

  build(ui, parent) {
    return new this.ctor(ui, parent);
  }

  static keyFor(name) {
    return name.toUpperCase();
  }
}

class FactoryRegistry {
  constructor() {
    this.registry = {};

    for (const name of DEFAULTS) {
      this.register(name, frameTypes[name]);
    }
  }

  get(name) {
    const key = FactoryNode.keyFor(name);
    return this.registry[key];
  }

  register(name, ctor, unique = false) {
    const key = FactoryNode.keyFor(name);
    this.registry[key] = new FactoryNode(name, ctor, unique);
  }
}

export default FactoryRegistry;
