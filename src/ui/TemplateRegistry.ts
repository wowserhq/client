import { HashMap, HashStrategy } from '../utils';

class TemplateNode {
  constructor(name, node) {
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

class TemplateRegistry extends HashMap {
  constructor() {
    super(HashStrategy.UPPERCASE);
  }

  filterByList(list) {
    return list.split(',').map(name => (
      this.get(name.trim())
    ));
  }

  register(node, name, tainted, status) {
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
