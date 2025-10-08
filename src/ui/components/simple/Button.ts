import DrawLayerType from '../../DrawLayerType';
import Script from '../../scripting/Script';
import UIContext from '../../UIContext';
import XMLNode from '../../XMLNode';
import { BlendMode } from '../../../gfx/types';
import { Status } from '../../../utils';

import ButtonState from './ButtonState';
import FontString from './FontString';
import Frame, { FrameFlag } from './Frame';
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
  isStateLocked: boolean;

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
    this.isStateLocked = false;

    this.enable(true);
    // TODO: Enable input events
    this.setFrameFlag(FrameFlag.Ox10000, true);
  }

  loadXML(node: XMLNode, status: Status) {
    super.loadXML(node, status);

    const ui = UIContext.instance;

    for (const child of node.children) {
      const iname = child.name.toLowerCase();
      switch (iname) {
        case 'normaltexture': {
          const texture = ui.createTexture(child, this, status);
          this.setStateTexture(ButtonState.NORMAL, texture);
          break;
        }
        case 'pushedtexture': {
          const texture = ui.createTexture(child, this, status);
          this.setStateTexture(ButtonState.PUSHED, texture);
          break;
        }
        case 'disabledtexture': {
          const texture = ui.createTexture(child, this, status);
          this.setStateTexture(ButtonState.DISABLED, texture);
          break;
        }
        case 'highlighttexture': {
          const texture = ui.createTexture(child, this, status);
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

  enable(enabled: boolean) {
    if (enabled) {
      if (this.state !== ButtonState.DISABLED) {
        return;
      }

      this.setState(ButtonState.NORMAL, false);

      // TODO: Mouse focus

      if (this.isHighlightLocked) {
        this.enableDrawLayer(DrawLayerType.HIGHLIGHT);
      }
    } else {
      if (this.state === ButtonState.DISABLED) {
        return;
      }

      // TODO: Mouse focus

      this.disableDrawLayer(DrawLayerType.HIGHLIGHT);
      this.setState(ButtonState.DISABLED, false);
    }

    this.setFrameFlag(FrameFlag.Ox400, !enabled);

    const script = enabled ? this.scripts.get('OnEnable') : this.scripts.get('OnDisable');

    if (script && script.luaRef !== null && !this.loading) {
      this.runScript(script);
    }
  }

  setHighlight(texture: Texture | null, _blendMode: BlendMode | null) {
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

  setState(state: ButtonState, locked: boolean) {
    this.isStateLocked = locked;

    if (state == this.state) {
      return;
    }

    if (this.activeTexture && (this.textures[state] || state == ButtonState.NORMAL)) {
      this.activeTexture.hide();
      this.activeTexture = null;
    }

    if (this.textures[state]) {
      this.activeTexture = this.textures[state];
      this.activeTexture.show();
    }

    this.updateTextState(state);

    this.state = state;
  }

  setStateTexture(state: ButtonState, texture: Texture | null) {
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

  updateTextState(_state: ButtonState) {
    // TODO
  }
}

export default Button;
