import { Vector2 } from '../../../math';

import LayoutFrame from './LayoutFrame';
import Type from './FramePointType';

class FramePoint {
  static UNDEFINED = Infinity;

  relative: LayoutFrame;
  type: Type;
  offset: Vector2;
  flags: number;

  constructor(relative: LayoutFrame, type: Type, offsetX: number, offsetY: number) {
    this.relative = relative;
    this.type = type;
    this.offset = new Vector2([offsetX, offsetY]);

    // TODO: Is this value correct?
    this.flags = 0;
  }

  get relativeRect() {
    const { relative } = this;

    // TODO: What does this flag signify?
    const initial = this.flags & 0x2;
    if (!initial) {
      this.flags |= 0x2;
    }

    this.flags &= ~0x4;

    if (relative.isResizePending) {
      relative.resize(true);
      if (this.flags & 0x4) {
        if (!initial) {
          this.flags &= ~0x2;
        }
        return undefined;
      }
    }

    if (relative.layoutFlags & 0x2) {
      relative.deferredResize = false;
      if (this.flags & 0x4) {
        if (!initial) {
          this.flags &= ~0x2;
        }
        return undefined;
      }
    }

    const rect = relative.getRect();
    if (!rect) {
      if (!initial) {
        this.flags &= ~0x2;
      }
      return undefined;
    }

    if (relative.isAttachmentOrigin) {
      rect.minY -= rect.minY;
      rect.minX -= rect.minX;
      rect.maxY -= rect.minY;
      rect.maxX -= rect.minX;
    }

    if (!initial) {
      this.flags &= ~0x2;
    }
    return rect;
  }

  markUnused() {
    this.type = Type.TOPLEFT - 1;
    this.offset.setElements(0.0, 0.0);
    // this.relative = null;
    this.flags = this.flags & 0x2 ? 0x2 | 0x4 | 0x8 : 0x8;
  }

  setRelative(relative: LayoutFrame, relativePoint: Type, offsetX: number, offsetY: number) {
    this.type = relativePoint;
    this.offset.setElements(offsetX, offsetY);
    this.relative = relative;
    this.flags = this.flags & 0x2 ? 0x2 | 0x4 : 0x0;
  }

  x(scale: number) {
    const { UNDEFINED } = FramePoint;

    const rect = this.relativeRect;
    if (!rect) {
      return UNDEFINED;
    }

    switch (this.type) {
      case Type.TOPLEFT:
      case Type.LEFT:
      case Type.BOTTOMLEFT:
        return rect.minX + (this.offset.x * scale);

      case Type.TOP:
      case Type.CENTER:
      case Type.BOTTOM:
        return ((rect.minX + rect.maxX) * 0.5) + (this.offset.x * scale);

      case Type.TOPRIGHT:
      case Type.RIGHT:
      case Type.BOTTOMRIGHT:
        return rect.maxX + (this.offset.x * scale);

      default:
        return UNDEFINED;
    }
  }

  y(scale: number) {
    const { UNDEFINED } = FramePoint;

    const rect = this.relativeRect;
    if (!rect) {
      return UNDEFINED;
    }

    switch (this.type) {
      case Type.TOPLEFT:
      case Type.TOP:
      case Type.TOPRIGHT:
        return rect.maxY + (this.offset.y * scale);

      case Type.LEFT:
      case Type.CENTER:
      case Type.RIGHT:
        return ((rect.minY + rect.maxY) * 0.5) + (this.offset.y * scale);

      case Type.BOTTOMLEFT:
      case Type.BOTTOM:
      case Type.BOTTOMRIGHT:
        return rect.minY + (this.offset.y * scale);

      default:
        return UNDEFINED;
    }
  }

  static synthesizeSide(center: number, opposite: number, size: number) {
    if (center !== this.UNDEFINED && opposite !== this.UNDEFINED) {
      return center + center - opposite;
    } else if (opposite !== this.UNDEFINED && size !== 0.0) {
      return opposite + size;
    } else if (center !== this.UNDEFINED && size !== 0.0) {
      return center + (size * 0.5);
    }
    return this.UNDEFINED;
  }

  static synthesizeCenter(side1: number, side2: number, size: number) {
    if (side1 !== this.UNDEFINED && side2 !== this.UNDEFINED) {
      return (side1 + side2) * 0.5;
    } else if (side1 !== this.UNDEFINED && size !== 0.0) {
      return side1 + (size * 0.5);
    } else if (side2 !== this.UNDEFINED && size !== 0.0) {
      return side2 - (size * 0.5);
    }
    return this.UNDEFINED;
  }
}

export default FramePoint;
