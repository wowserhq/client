import { Status, path, stringToBoolean } from '../utils';
import Client from '../Client';
import DrawLayerType from '../gfx/DrawLayerType';

import FactoryRegistry from './components/FactoryRegistry';
import FontString from './components/simple/FontString';
import Frame from './components/simple/Frame';
import Root from './components/Root';
import ScriptingContext from './scripting/Context';
import TemplateRegistry from './TemplateRegistry';
import Texture from './components/simple/Texture';
import XMLNode from './xml/Node';

class UIContext {
  constructor() {
    this.constructor.instance = this;

    this.scripting = new ScriptingContext();
    this.factories = new FactoryRegistry();
    this.templates = new TemplateRegistry();

    this.frames = {};

    this.root = new Root();
  }

  getParentNameFor(node) {
    let parentName = node.attributes.get('parent');
    if (parentName) {
      return parentName;
    }

    const inherits = node.attributes.get('inherits');
    if (inherits) {
      const templates = this.templates.filterByList(inherits);
      for (const template of templates) {
        // TODO: Does this bit require lock/release of templates?
        if (template && !template.locked) {
          parentName = node.attributes.get('parent');
        }
      }
    }

    return parentName;
  }

  createFrame(node, parent, status = new Status()) {
    const name = node.attributes.get('name');
    if (name) {
      status.info(`creating ${node.name} named ${name}`);
    } else {
      status.info(`creating unnamed ${node.name}`);
    }

    const factory = this.factories.get(node.name);
    if (!factory) {
      status.warning(`no factory for frame type: ${node.name}`);
      return null;
    }

    const parentName = this.getParentNameFor(node);
    if (parentName) {
      parent = Frame.getObjectByName(parentName);
      if (!parent) {
        status.warning(`could not find frame parent: ${parentName}`);
      }
    }

    const frame = factory.build(parent);
    if (!frame) {
      status.warning(`unable to create frame type: ${node.name}`);
      return null;
    }

    // TODO: Handle unique factories
    frame.preLoadXML(node);
    frame.loadXML(node);
    frame.postLoadXML(node);

    if (frame.name) {
      this.frames[frame.name] = frame;
    }

    return frame;
  }

  createFontString(node, frame) {
    const fontString = new FontString(frame, DrawLayerType.ARTWORK, true);
    fontString.preLoadXML(node);
    fontString.loadXML(node);
    fontString.postLoadXML(node);
    return fontString;
  }

  createTexture(node, frame) {
    const texture = new Texture(frame, DrawLayerType.ARTWORK, true);
    texture.preLoadXML(node);
    texture.loadXML(node);
    texture.postLoadXML(node);
    return texture;
  }

  async load(tocPath, status = new Status()) {
    status.info('loading toc', tocPath);

    const dirPath = path.dirname(tocPath);

    const toc = await Client.instance.fetch(tocPath);
    if (!toc) {
      status.error(`could not open ${tocPath}`);
      return;
    }

    const lines = toc.split('\r\n');

    for (const line of lines) {
      if (!line || line.startsWith('#')) {
        continue;
      }

      const filePath = path.join(dirPath, line);
      await this.loadFile(filePath, status);
    }
  }

  async loadFile(filePath, status = new Status()) {
    status.info('loading file', filePath);

    const source = await Client.instance.fetch(filePath);

    // Handle Lua files
    if (filePath.endsWith('.lua')) {
      return this.scripting.execute(source, filePath);
    }

    // Assume rest are XML files
    const node = XMLNode.parse(source);

    // TODO: Tainted code handling

    const dirPath = path.dirname(filePath);

    for (const child of node.children) {
      const { attributes, body } = child;

      const iname = child.name.toLowerCase();
      switch (iname) {
        case 'include': {
          const file = attributes.get('file');
          if (file) {
            // TODO: Is this legit?
            const includePath = path.join(dirPath, file);
            await this.loadFile(includePath);
          } else {
            status.error("element 'Include' without file attribute");
          }
        } break;

        case 'script': {
          const file = attributes.get('file');
          if (file) {
            // TODO: Is this legit?
            const luaPath = path.join(dirPath, file);
            await this.loadFile(luaPath);
          } else if (body) {
            this.scripting.execute(body, `${filePath}:<Scripts>`);
          }
        } break;

        case 'font': {
          // TODO: Font support
        } break;

        // Other frame nodes
        default: {
          const name = attributes.get('name');
          const virtual = attributes.get('virtual');
          if (stringToBoolean(virtual)) {
            if (name) {
              this.templates.register(child, name, null, status);
            } else {
              status.warning('unnamed virtual node at top level');
            }
          } else {
            this.createFrame(child, null, status);
            // TODO: Re-layout
          }
        }
      }
    }
  }
}

export default UIContext;
