import { HashMap, HashStrategy } from '../../utils';

import {
  Button, CheckButton, EditBox, Frame, Model, ScrollFrame, SimpleHTML, Slider
} from '.';

const DEFAULT_FACTORIES = {
  Button, CheckButton, EditBox, Frame, Model, ScrollFrame, SimpleHTML, Slider
};

type FactoryConstructor = new (parent: Frame | null) => Frame;

class FactoryNode {
  name: string;
  ctor: FactoryConstructor;
  unique: boolean;

  constructor(name: string, ctor: FactoryConstructor, unique = false) {
    this.name = name;
    this.ctor = ctor;
    this.unique = unique;
  }

  build(parent: Frame | null): Frame | null {
    return new this.ctor(parent);
  }
}

class FactoryRegistry extends HashMap<string, FactoryNode> {
  constructor() {
    super(HashStrategy.UPPERCASE);

    for (const [name, ctor] of Object.entries(DEFAULT_FACTORIES)) {
      this.register(name, ctor);
    }
  }

  register(name: string, ctor: FactoryConstructor, unique = false) {
    const node = new FactoryNode(name, ctor, unique);
    this.set(name, node);
  }
}

export default FactoryRegistry;
