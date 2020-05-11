import DrawLayerType from '../../../DrawLayerType';
import Frame from '../Frame';
import Script from '../../../scripting/Script';
import UIContext from '../../../Context';

import ButtonState from './State';
import * as scriptFunctions from './script';

class Button extends Frame {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  constructor(...args) {
    super(...args);

    this.scripts.register(
      new Script('PreClick', ['button', 'down']),
      new Script('OnClick', ['button', 'down']),
      new Script('PostClick', ['button', 'down']),
      new Script('OnDoubleClick', ['button']),
    );

    this.textures = {
      [ButtonState.DISABLED]: null,
      [ButtonState.NORMAL]: null,
      [ButtonState.PUSHED]: null,
    };

    this.activeTexture = null;
    this.highlightTexture = null;

    this.fontString = null;

    this.state = ButtonState.DISABLED;
  }

  loadXML(node) {
    super.loadXML(node);

    const ui = UIContext.instance;

    for (const child of node.children) {
      const iname = child.name.toLowerCase();
      switch (iname) {
        case 'normaltexture': {
          const texture = ui.createTexture(child, this);
          this.setStateTexture(ButtonState.NORMAL, texture);
        } break;
        case 'pushedtexture': {
          const texture = ui.createTexture(child, this);
          this.setStateTexture(ButtonState.PUSHED, texture);
        } break;
        case 'disabledtexture': {
          const texture = ui.createTexture(child, this);
          this.setStateTexture(ButtonState.DISABLED, texture);
        } break;
        case 'highlighttexture': {
          const texture = ui.createTexture(child, this);
          // TODO: Blend mode
          this.setHighlight(texture, null);
        } break;
        case 'buttontext':
          ui.createFontString(child, this);
          // TODO: Reference above font string on this button
          break;
        // TODO: Text and font children
      }
    }

    // TODO: Text, click registration and motion scripts
  }

  setHighlight(texture, _blendMode) {
    if (this.highlightTexture === texture) {
      return;
    }

    if (this.highlightTexture) {
      // TODO: Destructor
    }

    if (texture) {
      texture.setFrame(this, DrawLayerType.HIGHLIGHT, true);
      // TODO: Blend mode
    }

    this.highlightTexture = texture;
  }

  setStateTexture(state, texture) {
    const stored = this.textures[state];
    if (stored === texture) {
      return;
    }

    if (stored === this.activeTexture) {
      this.activeTexture = null;
    }

    if (stored) {
      // TODO: Destructor
    }

    if (texture) {
      texture.setFrame(this, DrawLayerType.ARTWORK, false);
    }

    this.textures[state] = texture;

    if (texture && state === this.state) {
      this.activeTexture = texture;
      // TODO: Show texture
    }
  }
}

export default Button;
