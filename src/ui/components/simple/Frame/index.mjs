import ScriptRegion from '../../abstract/ScriptRegion';
import * as scriptFunctions from './script';

class Frame extends ScriptRegion {
  static get scriptFunctions() {
    return scriptFunctions;
  }

  constructor(parent) {
    super();

    this.loading = false;
    this.shown = false;

    this.parent = parent;

    // TODO: Draw layers

    this.show();
  }

  preLoadXML(node) {
    const { id, name } = node.attributes;

    if (name) {
      this.name = name;
    }

    if (id) {
      // TODO: Assign identifier for this frame
    }

    this.loading = true;
    this.shown = false;

    this.deferredResize = true;

    // TODO: Handle title region
    // TODO: Handle regions
  }

  loadXML(node) {
  }

  postLoadXML(node) {
  }

  show() {
    if (this.protectedFunctionsAllowed) {
      this.shown = true;
      // TODO
    } else {
      // TODO
    }
  }
}

export default Frame;
