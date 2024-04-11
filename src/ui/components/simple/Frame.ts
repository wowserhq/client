import Backdrop from '../Backdrop';
import DrawLayerType from '../../DrawLayerType';
import FrameStrataType from '../abstract/FrameStrataType';
import Region from './Region';
import RenderBatch from '../../rendering/RenderBatch';
import UIRoot from '../UIRoot';
import Script from '../../scripting/Script';
import ScriptRegion from '../abstract/ScriptRegion';
import UIContext from '../../UIContext';
import XMLNode from '../../XMLNode';
import {
  EnumRecord,
  LinkedList,
  LinkedListLink,
  LinkedListNode,
  Status,
  stringToBoolean,
} from '../../../utils';
import { Rect } from '../../../math';
import {
  stringToDrawLayerType,
  stringToFrameStrataType,
} from '../../utils';

import FrameFlag from './FrameFlag';
import TitleRegion from './TitleRegion';
import * as scriptFunctions from './Frame.script';

class FrameNode extends LinkedListNode {
  frame: Frame;

  constructor(frame: Frame) {
    super();

    this.frame = frame;
  }
}

class Frame extends ScriptRegion {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  id: number;
  flags: number;
  titleRegion: TitleRegion | null;

  loading: boolean;
  shown: boolean;
  visible: boolean;
  strataType: FrameStrataType;
  level: number;

  layersEnabled: EnumRecord<DrawLayerType, boolean>;
  backdrop: Backdrop | null;

  regions: LinkedList<Region>;
  layers: Record<DrawLayerType, LinkedList<Region>>;
  children: LinkedList<FrameNode>;

  framesLink: LinkedListLink<this>;
  destroyedLink: LinkedListLink<this>;
  strataLink: LinkedListLink<this>;

  constructor(parent: Frame | null) {
    super();

    this.id = 0;
    this.flags = 0;
    this.titleRegion = null;

    this.loading = false;
    this.shown = false;
    this.visible = false;
    this.strataType = FrameStrataType.MEDIUM;
    this.level = 0;

    this.layersEnabled = [
      true,
      true,
      true,
      true,
      false,
    ];
    this.backdrop = null;

    this.regions = LinkedList.using('regionLink');
    this.layers = [
      LinkedList.using('layerLink'),
      LinkedList.using('layerLink'),
      LinkedList.using('layerLink'),
      LinkedList.using('layerLink'),
      LinkedList.using('layerLink'),
    ];
    this.children = LinkedList.using('link');

    this.framesLink = LinkedListLink.for(this);
    this.destroyedLink = LinkedListLink.for(this);
    this.strataLink = LinkedListLink.for(this);

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

    const root = UIRoot.instance;
    root.register(this);

    this.parent = parent;

    this.show();
  }

  setFrameFlag(flag: number, on: boolean) {
    if (on) {
      this.flags |= flag;
    } else {
      this.flags &= ~flag;
    }
  }

  setFrameLevel(level: number, shiftChildren = false) {
    level = Math.max(level, 0);

    if (this.level === level) {
      return;
    }

    const delta = Math.min(level - this.level, 128);

    const root = UIRoot.instance;

    if (this.visible) {
      root.hideFrame(this, true);
    }

    this.level += delta;

    if (this.visible) {
      root.showFrame(this, true);
    }

    if (shiftChildren) {
      for (const child of this.children) {
        child.frame.setFrameLevel(child.frame.level + delta, true);
      }
    }
  }

  setFrameStrataType(strataType: FrameStrataType) {
    if (this.strataType === strataType) {
      return;
    }

    const root = UIRoot.instance;

    if (this.visible) {
      root.hideFrame(this, true);
    }

    this.strataType = strataType;

    if (this.visible) {
      root.showFrame(this, true);
    }

    for (const child of this.children) {
      child.frame.setFrameStrataType(strataType);
    }
  }

  // Note: Seems to be necessary with split getter/setters + inheritance
  get parent() {
    return this._parent;
  }

  set parent(parent) {
    if (this._parent === parent) {
      return;
    }

    // TODO: Handle detachment of previous parent (if any)

    if (this.visible) {
      this.hideThis();
    }

    this._parent = parent;

    if (parent) {
      this.setFrameStrataType(parent.strataType);
      this.setFrameLevel(parent.level + 1, true);

      // TODO: Alpha and scrolling adjustments
    } else {
      this.setFrameStrataType(FrameStrataType.MEDIUM);
      this.setFrameLevel(0, true);

      // TODO: Alpha and scrolling adjustments
    }

    if (parent) {
      // TODO: Parent attachment protection
      const node = new FrameNode(this);
      parent.children.linkToHead(node);
    }

    if (this.shown) {
      if (!parent || parent.visible) {
        this.showThis();
      }
    }
  }

  preLoadXML(node: XMLNode) {
    super.preLoadXML(node);

    const id = node.attributes.get('id');
    if (id) {
      const idValue = parseInt(id, 10);
      if (idValue >= 0) {
        this.id = idValue;
      }
    }

    this.loading = true;

    this.deferredResize = true;

    // TODO: Handle deferred resize for title region

    for (const region of this.regions) {
      region.deferredResize = true;
    }
  }

  loadXML(node: XMLNode, status: Status) {
    // TODO: Group attribute extraction together with usage
    const dontSavePosition = node.attributes.get('dontSavePosition');
    const frameLevel = node.attributes.get('frameLevel');
    const frameStrata = node.attributes.get('frameStrata');
    const hidden = node.attributes.get('hidden');
    const inherits = node.attributes.get('inherits');
    const movable = node.attributes.get('movable');
    const resizable = node.attributes.get('resizable');
    const toplevel = node.attributes.get('toplevel');

    if (inherits) {
      const templates = UIContext.instance.templates.filterByList(inherits);
      for (const { name, template } of templates) {
        if (template) {
          if (template.locked) {
            status.warning(`recursively inherited node: ${name}`);
          } else {
            template.lock();
            this.loadXML(template.node, status);
            template.release();
          }
        } else {
          status.warning(`could not find inherited node: ${name}`);
        }
      }
    }

    super.loadXML(node, status);

    if (hidden) {
      if (stringToBoolean(hidden)) {
        this.hide();
      } else {
        this.show();
      }
    }

    if (toplevel) {
      this.setFrameFlag(FrameFlag.TOPLEVEL, stringToBoolean(toplevel));
    }

    if (movable) {
      this.setFrameFlag(FrameFlag.MOVABLE, stringToBoolean(toplevel));
    }

    if (dontSavePosition) {
      this.setFrameFlag(FrameFlag.DONT_SAVE_POSITION, stringToBoolean(dontSavePosition));
    }

    if (resizable) {
      this.setFrameFlag(FrameFlag.RESIZABLE, stringToBoolean(resizable));
    }

    if (frameStrata) {
      const strataType = stringToFrameStrataType(frameStrata);
      if (strataType !== undefined) {
        this.setFrameStrataType(strataType);
      } else {
        // TODO: Error handling
      }
    }

    if (frameLevel) {
      const level = parseInt(frameLevel, 10);

      if (level > 0) {
        this.setFrameLevel(level, true);
      } else {
        // TODO: Error handling
      }
    }

    // TODO: Alpha

    // TODO: Enable mouse events

    // TODO: Enable keyboard events

    // TODO: Clamped to screen behaviour

    // TODO: Protected

    // TODO: Depth

    for (const child of node.children) {
      const iname = child.name.toLowerCase();
      switch (iname) {
        // TODO: TitleRegion, ResizeBounds & HitRectInsects
        case 'backdrop': {
          const backdrop = new Backdrop();
          backdrop.loadXML(child);
          this.setBackdrop(backdrop);
        } break;
        case 'layers':
          this.loadXMLLayers(child, status);
          break;
        case 'attributes':
          // TODO: Load attributes
          break;
        case 'scripts':
          this.loadXMLScripts(child);
          break;
      }
    }
  }

  loadXMLLayers(node: XMLNode, status: Status) {
    const ui = UIContext.instance;

    for (const layer of node.children) {
      if (layer.name.toLowerCase() !== 'layer') {
        // TODO: Error handling
        continue;
      }

      const level = layer.attributes.get('level');

      const drawLayerType = stringToDrawLayerType(level) ?? DrawLayerType.ARTWORK;

      for (const layerChild of layer.children) {
        const iname = layerChild.name.toLowerCase();
        switch (iname) {
          case 'texture': {
            const texture = ui.createTexture(layerChild, this, status);
            texture.setFrame(this, drawLayerType, texture.shown);
          } break;
          case 'fontstring': {
            const fontstring = ui.createFontString(layerChild, this);
            fontstring.setFrame(this, drawLayerType, fontstring.shown);
          } break;
          default:
            // TODO: Error handling
        }
      }
    }
  }

  loadXMLScripts(node: XMLNode) {
    for (const child of node.children) {
      const script = this.scripts.get(child.name);
      if (script) {
        script.loadXML(child);

        // TODO: Register for events
      } else {
        // TOOD: Error handling
        console.error(`frame ${this.name}: unknown script element ${child.name}`);
      }
    }
  }

  postLoadXML(node: XMLNode, status: Status) {
    this.loading = false;

    // TODO: More stuff

    if (this.visible) {
      this.deferredResize = false;

      if (this.titleRegion) {
        this.titleRegion.deferredResize = false;
      }

      for (const region of this.regions) {
        region.deferredResize = false;
      }
    }

    this.postLoadXMLFrames(node, status);

    // TODO: Alpha animations

    this.runOnLoadScript();

    if (this.visible) {
      this.runOnShowScript();
    }
  }

  postLoadXMLFrames(node: XMLNode, status: Status) {
    const ui = UIContext.instance;

    const inherits = node.attributes.get('inherits');
    if (inherits) {
      const templates = ui.templates.filterByList(inherits);
      for (const { template } of templates) {
        if (template && !template.locked) {
          template.lock();
          this.postLoadXMLFrames(template.node, status);
          template.release();
        }
      }
    }

    const frames = node.getChildByName('Frames');
    if (frames) {
      for (const frame of frames.children) {
        ui.createFrame(frame, this, status);
      }
    }
  }

  setBackdrop(backdrop: Backdrop) {
    if (this.backdrop) {
      // TODO: Destructor
    }

    if (backdrop) {
      backdrop.setOutput(this);
    }
    this.backdrop = backdrop;
  }

  show() {
    if (this.protectedFunctionsAllowed) {
      this.shown = true;
      this.showThis();
    } else {
      // TODO
    }
  }

  showThis() {
    if (!this.shown) {
      return false;
    }

    if (this.parent && !this.parent.visible) {
      return false;
    }

    if (this.visible) {
      return true;
    }

    if (!this.loading) {
      this.deferredResize = false;

      // TODO: Is this correct?
      if (this.titleRegion) {
        this.titleRegion.deferredResize = false;
      }
    }

    const root = UIRoot.instance;

    this.visible = true;

    root.showFrame(this, false);

    for (const region of this.regions) {
      region.showThis();
    }

    for (const child of this.children) {
      child.frame.showThis();
    }

    if (this.flags & FrameFlag.TOPLEVEL) {
      root.raiseFrame(this, true);
    }

    this.onLayerShow();

    return true;
  }

  hide() {
    if (this.protectedFunctionsAllowed) {
      this.shown = false;
      this.hideThis();
    } else {
      // TODO
    }
  }

  hideThis() {
    if (!this.visible) {
      return true;
    }

    if (!this.loading) {
      this.deferredResize = true;

      if (this.titleRegion) {
        this.titleRegion.deferredResize = true;
      }
    }

    this.visible = false;
    UIRoot.instance.hideFrame(this, false);

    for (const region of this.regions) {
      region.hideThis();
    }

    for (const child of this.children) {
      child.frame.hideThis();
    }

    this.onLayerHide();

    return true;
  }

  addRegion(region: Region, drawLayerType: DrawLayerType) {
    // TODO: Layout scaling

    console.debug(`adding ${region.name} as frame region to ${this.name} on layer ${drawLayerType}`);

    this.layers[drawLayerType].add(region);
    this.notifyDrawLayerChanged(drawLayerType);
  }

  removeRegion(region: Region, drawLayerType: DrawLayerType) {
    this.layers[drawLayerType].unlink(region);
    this.notifyDrawLayerChanged(drawLayerType);
  }

  notifyDrawLayerChanged(drawLayerType: DrawLayerType) {
    const root = UIRoot.instance;

    // TODO: Constantize frame flag
    if (this.flags & 0x2000) {
      // TODO: Implementation
    } else if (root && this.visible) {
      root.notifyFrameLayerChanged(this, drawLayerType);
    }

    // TODO: Notify scroll parent
  }

  onFrameRender(batch: RenderBatch) {
    const { drawLayerType } = batch;

    if (!this.layersEnabled[drawLayerType]) {
      return;
    }

    for (const region of this.layers[drawLayerType]) {
      region.draw(batch);
    }
  }

  onFrameSizeChanged(rect: Rect) {
    super.onFrameSizeChanged(rect);

    // TODO: Set hit rect

    if (this.backdrop) {
      this.backdrop.update(this.rect);
    }

    // TODO: Remaining implementation
  }

  onLayerShow() {
    this.runOnShowScript();
  }

  onLayerHide() {
    this.runOnHideScript();
  }

  onLayerUpdate(_elapsedSecs: number) {
    // TODO: Run update script

    // TODO: Run PreOnAnimUpdate hooks

    // TODO: Implement ScriptRegion.onLayerUpdate
    // super.onLayerUpdate(elapsedSecs);

    for (const _region of this.regions) {
      // TODO: Implement Region.onLayerUpdate
      // region.onLayerUpdate(elapsedSecs);
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
export { FrameFlag };
