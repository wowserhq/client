import { HashMap, HashStrategy } from '../utils';
import { lua_Ref } from '../ui/scripting/lua';

class XMLNode {
  parent: XMLNode | null;
  name: string;
  attributes: HashMap<string, string>;
  children: XMLNode[];
  body: string | null;
  scriptLuaRef: lua_Ref | null;

  constructor(parent: XMLNode | null, name: string) {
    this.parent = parent;
    this.name = name;
    this.attributes = new HashMap(HashStrategy.UPPERCASE);
    this.children = [];
    this.body = null;
    this.scriptLuaRef = null;
  }

  get firstChild() {
    return this.children[0];
  }

  getChildByName(name: string) {
    const iname = name.toLowerCase();
    return this.children.find(child => (
      child.name.toLowerCase() === iname
    ));
  }

  static parse(source: string) {
    const parser = new DOMParser();
    const document = parser.parseFromString(source, 'application/xml');

    const transform = (element: Element, parent: XMLNode | null = null) => {
      const node = new this(parent, element.tagName);

      const { attributes } = node;
      for (const attr of element.attributes) {
        attributes.set(attr.name, attr.value);
      }

      if (element.children.length) {
        for (const child of element.children) {
          node.children.push(transform(child, node));
        }
      } else if (element.textContent) {
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
