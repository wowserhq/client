import Script from '../../../scripting/Script';
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
    this.scripts.register(
      new Script('OnLoad'),
      new Script('OnSizeChanged', ['w', 'h']),
      new Script('OnUpdate', ['elapsed']),
      new Script('OnShow'),
      new Script('OnHide'),
      new Script('OnEnter', ['motion']),
      new Script('OnLeave', ['motion']),
      new Script('OnMouseDown', ['button']),
      new Script('OnMouseUp', ['button']),
      new Script('OnMouseWheel', ['delta']),
      new Script('OnDragStart', ['button']),
      new Script('OnDragStop'),
      new Script('OnReceiveDrag'),
      new Script('OnChar', ['text']),
      new Script('OnKeyDown', ['key']),
      new Script('OnKeyUp', ['key']),
      new Script('OnAttributeChange', ['name', 'value']),
      new Script('OnEnable'),
      new Script('OnDisable'),
    );

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

  runOnHideScript() {
    if (!this.loading) {
      this.runScript('OnHide');
    }
  }

  runOnLoadScript() {
    this.runScript('OnLoad');
  }

  runOnShowScript() {
    if (!this.loading) {
      this.runScript('OnShow');
    }
  }
}

export default Frame;
