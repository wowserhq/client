import DrawLayerType from '../../DrawLayerType';
import Script from '../../scripting/Script';
import UIContext from '../../UIContext';
import XMLNode from '../../XMLNode';
import { BlendMode } from '../../../gfx/types';

import ButtonState from './ButtonState';
import FontString from './FontString';
import Frame from './Frame';
import Texture from './Texture';

import * as scriptFunctions from './Button.script';

class Button extends Frame {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  textures: Record<ButtonState, Texture | null>;

  activeTexture: Texture | null;
  highlightTexture: Texture | null;

  fontString: FontString | null;

  state: ButtonState;

  constructor(parent: Frame | null) {
    super(parent);

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

  loadXML(node: XMLNode) {
    super.loadXML(node);

    const ui = UIContext.instance;

    for (const child of node.children) {
      const iname = child.name.toLowerCase();
      switch (iname) {
        case 'normaltexture': {
          const texture = ui.createTexture(child, this);
          this.setStateTexture(ButtonState.NORMAL, texture);
          break;
        }
        case 'pushedtexture': {
          const texture = ui.createTexture(child, this);
          this.setStateTexture(ButtonState.PUSHED, texture);
          break;
        }
        case 'disabledtexture': {
          const texture = ui.createTexture(child, this);
          this.setStateTexture(ButtonState.DISABLED, texture);
          break;
        }
        case 'highlighttexture': {
          const texture = ui.createTexture(child, this);
          // TODO: Blend mode
          this.setHighlight(texture, null);
          break;
        }
        case 'buttontext':
          ui.createFontString(child, this);
          // TODO: Reference above font string on this button
          break;
        // TODO: Text and font children
      }
    }

    // TODO: Text, click registration and motion scripts
  }

  setHighlight(texture: Texture, _blendMode: BlendMode | null) {
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

  setStateTexture(state: ButtonState, texture: Texture) {
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
      texture.show();
    }
  }
}

export default Button;
