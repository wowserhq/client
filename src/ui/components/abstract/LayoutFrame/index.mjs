import ScriptRegion from '../ScriptRegion';
import { Rect } from '../../../../math';
import { extractDimensionsFrom, stringToBoolean } from '../../../../utils';

import Point from './Point';

class LayoutFrame {
  constructor() {
    this.layoutFlags = 0;

    this.rect = new Rect();
    this._width = 0;
    this._height = 0;

    this.layoutScale = 1.0;
    this.layoutDepth = 1.0;

    this.guard = 0;

    this.points = {};
  }

  get layoutParent() {
    return null;
  }

  set deferredResize(enable) {
    if (enable) {
      this.layoutFlags |= 0x2;

      // TODO: Remove this layout frame from pending list if it's linked

      return;
    }

    this.layoutFlags &= ~0x2;

    if (this.layoutFlags & 0x4) {
      this.resize(true);
    }
  }

  loadXML(node) {
    const size = node.getChildByName('Size');
    if (size) {
      const { x, y } = extractDimensionsFrom(size);

      if (x) {
        this.width = x;
      }

      if (y) {
        this.height = y;
      }
    }

    // TODO: Anchors, positioning++

    const layoutParent = this.layoutParent;

    const setAllPoints = stringToBoolean(node.attributes.get('setAllPoints'));

    const anchors = node.getChildByName('Anchors');
    if (anchors) {
      if (setAllPoints) {
        // TODO: Error handling
      }

      for (const child of anchors.children) {
        const pointValue = child.attributes.get('point');
        const relativePointValue = child.attributes.get('relativePoint');
        const relativeToValue = child.attributes.get('relativeTo');

        // TODO: Case sensitivity
        const point = Point[pointValue];
        if (!point) {
          // TODO: Error handling
          continue;
        }

        let relativePoint = point;
        if (relativePointValue) {
          // TODO: Case sensitivity
          relativePoint = Point[relativePointValue];
          if (!relativePoint) {
            // TODO: Error handling
            continue;
          }
        }

        let relativeTo = layoutParent;
        if (relativeToValue) {
          const fqname = this.fullyQualifyName(relativeToValue);
          relativeTo = ScriptRegion.getObjectByName(fqname);
          if (!relativeTo) {
            // TODO: Error handling
            console.warn(`could not find relative frame: ${fqname}`);
            continue;
          }

          if (relativeTo === this) {
            // TODO: Error handling
            continue;
          }
        }

        const offsetNode = child.getChildByName('Offset');
        const {
          x: offsetX,
          y: offsetY,
        } = extractDimensionsFrom(offsetNode || child);

        this.setPoint(point, relativeTo, relativePoint, offsetX, offsetY, false);
      }

      this.resize(false);
    } else if (setAllPoints) {
      // TODO: set all points on layout parent
    }
  }

  get width() {
    return this._width;
  }

  set width(width) {
    this.layoutFlags &= ~0x8;
    this._width = width;
    this.resize(false);
  }

  get height() {
    return this._height;
  }

  set height(height) {
    this.layoutFlags &= ~0x8;
    this._height = height;
    this.resize(false);
  }

  canBeAnchorFor(_other) {
    // TODO: Implementation
    return true;
  }

  setPoint(point, relativeTo, relativePoint, _offsetX = 0, _offsetY = 0, _resize = false) {
    if (!relativeTo.canBeAnchorFor(this)) {
      return;
    }

    // TODO: Implementation
  }

  resize(_force = false) {
    // TODO
  }

  static resizePending() {
    // TOOD: Mark frames as resized
  }
}

export default LayoutFrame;
export { Point as LayoutFramePoint };
