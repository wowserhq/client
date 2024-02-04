import { HashMap, HashStrategy } from '../../utils';

import * as frameTypes from '.';

const DEFAULT_FACTORIES = [
  'Button',
  'CheckButton',
  'EditBox',
  'Frame',
  'Model',
  'ScrollFrame',
  'SimpleHTML',
  'Slider',
];

class FactoryNode {
  constructor(name, ctor, unique = false) {
    this.name = name;
    this.ctor = ctor;
    this.unique = unique;
  }

  build(parent) {
    return new this.ctor(parent);
  }
}

class FactoryRegistry extends HashMap {
  constructor() {
    super(HashStrategy.UPPERCASE);

    for (const name of DEFAULT_FACTORIES) {
      this.register(name, frameTypes[name]);
    }
  }

  register(name, ctor, unique = false) {
    const node = new FactoryNode(name, ctor, unique);
    this.set(name, node);
  }
}

export default FactoryRegistry;
