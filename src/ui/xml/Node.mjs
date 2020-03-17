import { HashMap, HashStrategy } from '../../utils';

class XMLNode {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
    this.attributes = new HashMap(HashStrategy.UPPERCASE);
    this.children = [];
    this.body = null;
  }

  get firstChild() {
    return this.children[0];
  }

  getChildByName(name) {
    const iname = name.toLowerCase();
    return this.children.find(child => (
      child.name.toLowerCase() === iname
    ));
  }

  static parse(source) {
    const parser = new DOMParser();
    const document = parser.parseFromString(source, 'application/xml');

    const transform = (element, parent = null) => {
      const node = new this(parent, element.tagName);

      const { attributes } = node;
      for (const attr of element.attributes) {
        attributes.set(attr.name, attr.value);
      }

      if (element.children.length) {
        for (const child of element.children) {
          node.children.push(transform(child, node));
        }
      } else {
        const trimmed = element.textContent.trim();
        if (trimmed) {
          node.body = trimmed;
        }
      }
      return node;
    };

    const root = transform(document.documentElement);
    return root;
  }
}

export default XMLNode;
