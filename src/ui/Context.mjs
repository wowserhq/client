import { Status, path } from '../utils';

import FactoryRegistry from './components/FactoryRegistry';
import LuaContext from './lua/Context';
import TemplateRegistry from './TemplateRegistry';
import XMLNode from './xml/Node';

class UIContext {
  constructor(client) {
    this.client = client;

    this.lua = new LuaContext(client);
    this.factories = new FactoryRegistry();
    this.templates = new TemplateRegistry();
  }

  findParentNameFor(node) {
    // TODO: Implement parent finding logic
    return null;
  }

  createFrame(node, parent, status) {
    const { name } = node.attributes;
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

    const parentName = this.findParentNameFor(node);
    if (parentName) {
      // TODO: Handle given parent name
      console.error('finding parent', parentName);
    }

    const frame = factory.build(this, parent);
    if (!frame) {
      status.warning(`unable to create frame type: ${node.name}`);
      return null;
    }

    // TODO: Handle unique factories
    frame.preLoadXML(node);
    frame.loadXML(node);
    frame.postLoadXML(node);

    return frame;
  }

  async load(tocPath, status = new Status()) {
    status.info('loading toc', tocPath);

    const dirPath = path.dirname(tocPath);

    const toc = await this.client.fetch(tocPath);
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

    const source = await this.client.fetch(filePath);

    // Handle Lua files
    if (filePath.endsWith('.lua')) {
      return this.lua.execute(source, filePath);
    }

    // Assume rest are XML files
    const node = XMLNode.parse(source);

    // TODO: Tainted code handling

    const dirPath = path.dirname(filePath);

    for (const child of node.children) {
      switch (child.name) {
        case 'Include': {
          const { attributes: { file } } = child;
          if (file) {
            // TODO
            console.warn("element 'Include' not yet supported");
          } else {
            status.error("element 'Include' without file attribute");
          }
        } break;

        case 'Script': {
          const { attributes: { file }, text } = child;
          if (file) {
            // TODO: Is this legit?
            const luaPath = path.join(dirPath, file);
            await this.loadFile(luaPath);
          } else if (text) {
            this.lua.execute(text, `${filePath}:<Scripts>`);
          }
        } break;

        // TODO: Font support
        case 'Font': {
          console.warn("element 'Font' not yet supported");
        } break;

        // Other frame nodes
        default: {
          const { attributes: { name, virtual } } = child;
          if (virtual !== 'true') {
            this.createFrame(child, null, status);
            // TODO: Re-layout
          } else {
            if (name) {
              this.templates.store(child, name, null, status);
            } else {
              status.warn('unnamed virtual node at top level');
            }
          }
        }
      }
    }
  }
}

export default UIContext;
