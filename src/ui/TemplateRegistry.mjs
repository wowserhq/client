class TemplateNode {
  constructor(name, node) {
    this.name = name;
    this.node = node;
    this.tainted = false;
    this.locked = false;
  }

  static keyFor(name) {
    return name.toUpperCase();
  }
}

class TemplateRegistry {
  constructor() {
    this.registry = {};
  }

  acquire(...args) {
    // TODO
  }

  release(...args) {
    // TODO
  }

  store(node, name, tainted, status) {
    const key = TemplateNode.keyFor(name);

    let entry = this.registry[key];
    if (entry) {
      if (!entry.tainted || tainted) {
        status.warn(`virtual frame named ${name} already exists`);
        return;
      }

      // TODO: What else to do in this scenario?
    } else {
      entry = new TemplateNode(name, node);
      entry.tainted = tainted;
      this.registry[key] = entry;
    }

    status.info(`added virtual frame ${name}`);
  }
}

export default TemplateRegistry;
