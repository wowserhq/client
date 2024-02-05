import DrawLayerType from '../../DrawLayerType';
import RenderBatch from '../../rendering/RenderBatch';
import ScriptRegion from '../abstract/ScriptRegion';
import { LinkedListLink } from '../../../utils';

import Frame from './Frame';

abstract class Region extends ScriptRegion {
  drawLayerType: DrawLayerType | null;
  shown: boolean;
  visible: boolean;

  colors: never[];
  alphas: never[];

  layerLink: LinkedListLink<this>;
  regionLink: LinkedListLink<this>;

  constructor(frame: Frame, drawLayerType: DrawLayerType, show: boolean) {
    super(null);

    this.drawLayerType = null;
    this.shown = false;
    this.visible = false;

    this.colors = [];
    this.alphas = [];

    this.layerLink = LinkedListLink.for(this);
    this.regionLink = LinkedListLink.for(this);

    if (frame) {
      this.setFrame(frame, drawLayerType, show);
    }
  }

  abstract draw(_batch: RenderBatch): void;

  onRegionChanged() {
    // TODO: Implementation
  }

  setFrame(frame: Frame, drawLayerType: DrawLayerType, show: boolean) {
    if (this._parent === frame) {
      if (this.drawLayerType === drawLayerType) {
        if (show !== this.shown) {
          if (show) {
            this.show();
          } else {
            this.hide();
          }
        }
      } else {
        if (this.shown) {
          this.hide();
        }

        this.drawLayerType = drawLayerType;

        if (show) {
          this.show();
        }
      }
    } else {
      if (this._parent) {
        this.hideThis();
        this._parent.regions.unlink(this);
      }

      this._parent = frame;
      this.drawLayerType = drawLayerType;

      if (frame) {
        frame.regions.add(this);
        this.deferredResize = !!(this._parent.layoutFlags & 0x2);

        // TODO: Color changed

        if (show) {
          this.show();
        } else {
          this.hide();
        }
      }
    }
  }

  hide() {
    this.shown = false;
    this.hideThis();
  }

  hideThis() {
    if (this.visible && this._parent) {
      if (!this._parent.loading) {
        this.deferredResize = true;
      }
      this._parent.removeRegion(this, this.drawLayerType!);
      this.visible = false;
    }
  }

  show() {
    this.shown = true;
    this.showThis();
  }

  showThis() {
    if (this.shown && this._parent && this._parent.visible && !this.visible) {
      if (!this._parent.loading) {
        this.deferredResize = false;
      }

      this._parent.addRegion(this, this.drawLayerType!);
      this.visible = true;
    }
  }
}

export default Region;
