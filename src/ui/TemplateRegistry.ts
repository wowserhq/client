import { HashMap, HashStrategy, Status } from '../utils';

import XMLNode from './XMLNode';

class TemplateNode {
  name: string;
  node: XMLNode;
  tainted: boolean;
  locked: boolean;

  constructor(name: string, node: XMLNode) {
    this.name = name;
    this.node = node;
    this.tainted = false;
    this.locked = false;
  }

  lock() {
    this.locked = true;
  }

  release() {
    this.locked = false;
  }
}

class TemplateRegistry extends HashMap<string, TemplateNode> {
  constructor() {
    super(HashStrategy.UPPERCASE);
  }

  filterByList(list: string) {
    return list.split(',').map((name: string) => ({
      name,
      template: this.get(name.trim())
    }));
  }

  register(node: XMLNode, name: string, tainted: boolean, status: Status) {
    let entry = this.get(name);
    if (entry) {
      if (!entry.tainted || tainted) {
        status.warning(`virtual frame named ${name} already exists`);
        return;
      }

      // TODO: What else to do in this scenario?
    } else {
      entry = new TemplateNode(name, node);
      entry.tainted = tainted;
      this.set(name, entry);
    }

    status.info(`registered virtual frame ${name}`);
  }
}

export default TemplateRegistry;
