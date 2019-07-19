import { HashMap, HashStrategy } from '../../utils';

class XMLNode {
  constructor(parent, name, attributes) {
    this.parent = parent;
    this.name = name;
    this.attributes = attributes;
    this.children = [];
    this.text = null;
  }

  static parse(source) {
    const parser = new DOMParser();
    const document = parser.parseFromString(source, 'application/xml');

    const transform = (element, parent = null) => {
      const attributes = Array.from(element.attributes).reduce((map, attr) => {
        map.set(attr.name, attr.value);
        return map;
      }, new HashMap(HashStrategy.UPPERCASE));

      const node = new this(parent, element.tagName, attributes);
      if (element.children.length) {
        for (const child of element.children) {
          node.children.push(transform(child, node));
        }
      } else {
        const trimmed = element.textContent.trim();
        if (trimmed) {
          node.text = trimmed;
        }
      }
      return node;
    };

    const root = transform(document.documentElement);
    return root;
  }
}

export default XMLNode;
