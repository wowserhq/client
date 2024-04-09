import ScriptRegion from './ScriptRegion';
import XMLNode from '../../XMLNode';
import {
  EPSILON1,
  EPSILON2,
  Rect,
  areClose,
} from '../../../math';
import {
  EnumRecord,
  LinkedList,
  LinkedListLink,
  LinkedListNode,
  NDCtoDDCHeight,
  NDCtoDDCWidth,
  extractDimensionsFrom,
  stringToBoolean,
} from '../../../utils';

import FramePoint from './FramePoint';
import FramePointType, {
  FramePointTypeSide,
  stringToPointType,
} from './FramePointType';

class FrameNode extends LinkedListNode {
  frame: LayoutFrame;
  changed: number;

  constructor(frame: LayoutFrame, changed: number = 0) {
    super();

    this.frame = frame;
    this.changed = changed;
  }
}

class LayoutFrame {
  static resizePendingList: LinkedList<LayoutFrame> = LinkedList.using('resizePendingLink');

  layoutFlags: number;

  rect: Rect;
  _width: number;
  _height: number;

  layoutScale: number;
  layoutDepth: number;

  guard: {
    left: boolean,
    top: boolean,
    right: boolean,
    bottom: boolean,
    centerX: boolean,
    centerY: boolean,
  };

  resizeList: LinkedList<FrameNode>;
  resizeCounter: number;
  _resizePendingLink?: LinkedListLink<LayoutFrame>;

  points: EnumRecord<FramePointType, FramePoint | null>;

  constructor() {
    this.layoutFlags = 0;

    this.rect = new Rect();
    this._width = 0;
    this._height = 0;

    this.layoutScale = 1.0;
    this.layoutDepth = 1.0;

    this.guard = {
      left: false,
      top: false,
      right: false,
      bottom: false,
      centerX: false,
      centerY: false,
    };

    this.resizeList = LinkedList.using('link');
    this.resizeCounter = NaN;

    this.points = [
      null, null, null,
      null, null, null,
      null, null, null,
    ];
  }

  // Note: LayoutFrame is used as an auxiliary baseclass using the `multipleClasses` utility, so creating this
  // link in the constructor would hold an invalid reference to a throw-away LayoutFrame instance
  get resizePendingLink() {
    if (!this._resizePendingLink) {
      this._resizePendingLink = LinkedListLink.for(this);
    }
    return this._resizePendingLink;
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

  get centerX() {
    if (this.guard.centerX) {
      return FramePoint.UNDEFINED;
    }
    this.guard.centerX = true;

    let centerX = this.getFirstPoint(FramePointTypeSide.CENTERX, 'x');
    if (centerX === FramePoint.UNDEFINED) {
      const size = this.width * this.layoutScale;
      const side2 = this.right;
      const side1 = this.left;
      centerX = FramePoint.synthesizeCenter(side1, side2, size);
    }

    this.guard.centerX = false;
    return centerX;
  }

  get centerY() {
    if (this.guard.centerY) {
      return FramePoint.UNDEFINED;
    }
    this.guard.centerY = true;

    let centerY = this.getFirstPoint(FramePointTypeSide.CENTERY, 'y');
    if (centerY === FramePoint.UNDEFINED) {
      const size = this.height * this.layoutScale;
      const side2 = this.top;
      const side1 = this.bottom;
      centerY = FramePoint.synthesizeCenter(side1, side2, size);
    }

    this.guard.centerY = false;
    return centerY;
  }

  get top() {
    if (this.guard.top) {
      return FramePoint.UNDEFINED;
    }
    this.guard.top = true;

    let top = this.getFirstPoint(FramePointTypeSide.TOP, 'y');
    if (top === FramePoint.UNDEFINED) {
      const size = this.height * this.layoutScale;
      const opposite = this.bottom;
      const center = this.centerY;
      top = FramePoint.synthesizeSide(center, opposite, size);
    }

    this.guard.top = false;
    return top;
  }

  get bottom() {
    if (this.guard.bottom) {
      return FramePoint.UNDEFINED;
    }
    this.guard.bottom = true;

    let bottom = this.getFirstPoint(FramePointTypeSide.BOTTOM, 'y');
    if (bottom === FramePoint.UNDEFINED) {
      const size = -(this.height * this.layoutScale);
      const opposite = this.top;
      const center = this.centerY;
      bottom = FramePoint.synthesizeSide(center, opposite, size);
    }

    this.guard.bottom = false;
    return bottom;
  }

  get left() {
    if (this.guard.left) {
      return FramePoint.UNDEFINED;
    }
    this.guard.left = true;

    let left = this.getFirstPoint(FramePointTypeSide.LEFT, 'x');
    if (left === FramePoint.UNDEFINED) {
      const size = -(this.width * this.layoutScale);
      const opposite = this.right;
      const center = this.centerX;
      left = FramePoint.synthesizeSide(center, opposite, size);
    }

    this.guard.left = false;
    return left;
  }

  get right() {
    if (this.guard.right) {
      return FramePoint.UNDEFINED;
    }
    this.guard.right = true;

    let right = this.getFirstPoint(FramePointTypeSide.RIGHT, 'x');
    if (right === FramePoint.UNDEFINED) {
      const size = this.width * this.layoutScale;
      const opposite = this.left;
      const center = this.centerX;
      right = FramePoint.synthesizeSide(center, opposite, size);
    }

    this.guard.right = false;
    return right;
  }

  get isAttachmentOrigin() {
    return false;
  }

  get isResizePending() {
    // TODO: Constantize flag
    return this.layoutFlags & 0x4;
  }

  get layoutParent(): LayoutFrame | null {
    return null;
  }

  set deferredResize(enable: boolean) {
    if (enable) {
      this.layoutFlags |= 0x2;

      if (LayoutFrame.resizePendingList.isLinked(this)) {
        LayoutFrame.resizePendingList.unlink(this);
      }
      return;
    }

    this.layoutFlags &= ~0x2;

    if (this.layoutFlags & 0x4) {
      this.resize(true);
    }
  }

  addToResizeList() {
    const { resizePendingList } = LayoutFrame;

    if (resizePendingList.isLinked(this)) {
      return;
    }

    // TODO: Implementation
  }

  calculateRect(rect: Rect) {
    rect.minX = this.left;
    if (rect.minX === FramePoint.UNDEFINED) {
      return false;
    }

    rect.minY = this.bottom;
    if (rect.minY === FramePoint.UNDEFINED) {
      return false;
    }

    rect.maxX = this.right;
    if (rect.maxX === FramePoint.UNDEFINED) {
      return false;
    }

    rect.maxY = this.top;
    if (rect.maxY === FramePoint.UNDEFINED) {
      return false;
    }

    // TODO: Constantize layout flags
    if (!(this.layoutFlags & 0x10)) {
      return true;
    }

    // TODO: getClampRectInsets
    const minWidth = -(this.layoutScale * 0);
    const width = NDCtoDDCWidth(1.0);
    const maxWidth = width - this.layoutScale * 0;
    const minHeight = -(this.layoutScale * 0);
    const height = NDCtoDDCHeight(1.0);
    const maxHeight = height - this.layoutScale * 0;

    if (minWidth > rect.minX) {
      rect.maxX = rect.maxX - (rect.minX - minWidth);
      rect.minX = minWidth;
    }

    if (minHeight > rect.minY) {
      rect.maxY = rect.maxY - (rect.minY - minHeight);
      rect.minY = minHeight;
    }

    if (maxWidth < rect.maxX) {
      rect.minX = rect.minX - (rect.maxX - maxWidth);
      rect.maxX = maxWidth;
    }

    if (maxHeight < rect.maxY) {
      rect.minY = rect.minY - (rect.maxY - maxHeight);
      rect.maxY = maxHeight;
    }

    return true;
  }

  canBeAnchorFor(_other: LayoutFrame) {
    // TODO: Implementation
    return true;
  }

  freePoints() {
    for (const point of this.points) {
      // TODO: Implementation
      console.error('freeing point', point);
    }
  }

  fullyQualifyName(_name: string): string | null {
    return null;
  }

  getFirstPoint(pointTypes: FramePointType[], prop: 'x' | 'y') {
    let value;
    for (const pointType of pointTypes) {
      const point = this.points[pointType];
      if (point && !(point.flags & 0x8)) {
        value = point[prop](this.layoutScale);
        if (point.flags & 0x4) {
          return FramePoint.UNDEFINED;
        }
        if (value !== FramePoint.UNDEFINED) {
          return value;
        }
      }
    }
    return FramePoint.UNDEFINED;
  }

  getRect() {
    if (!(this.layoutFlags & 0x1)) {
      return undefined;
    }

    const rect = new Rect();
    rect.set(this.rect);
    return rect;
  }

  loadXML(node: XMLNode) {
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
        const relativeValue = child.attributes.get('relativeTo');

        const pointType = stringToPointType(pointValue);
        let relativePointType = pointType;
        if (!pointType) {
          // TODO: Error handling
          continue;
        }

        if (relativePointValue) {
          relativePointType = stringToPointType(relativePointValue);
          if (!relativePointType) {
            // TODO: Error handling
            continue;
          }
        }

        let relative = layoutParent;
        if (relativeValue) {
          const fqname = this.fullyQualifyName(relativeValue)!;
          relative = ScriptRegion.getObjectByName(fqname);
          if (!relative) {
            // TODO: Error handling
            console.warn(`could not find relative frame: ${fqname}`);
            continue;
          }

          if (relative === this) {
            // TODO: Error handling
            continue;
          }
        }

        const offsetNode = child.getChildByName('Offset');
        const {
          x: offsetX,
          y: offsetY,
        } = extractDimensionsFrom(offsetNode || child);

        this.setPoint(pointType, relative, relativePointType!, offsetX, offsetY, false);
      }

      this.resize(false);
    } else if (setAllPoints) {
      this.setAllPoints(layoutParent, true);
    }
  }

  onFrameResize() {
    const rect = new Rect();

    // TODO: Constantize layout flags
    if (!this.calculateRect(rect)) {
      this.layoutFlags = (this.layoutFlags & ~0x1) | 0x8;
      return false;
    }

    this.layoutFlags &= ~(0x4 | 0x8);

    if (
      this.layoutFlags & 0x1
      && areClose(rect.minX, this.rect.minX, EPSILON2)
      && areClose(rect.maxX, this.rect.maxX, EPSILON2)
      && areClose(rect.minY, this.rect.minY, EPSILON2)
      && areClose(rect.maxY, this.rect.maxY, EPSILON2)
    ) {
      return true;
    }

    const prevRect = new Rect().set(this.rect);

    this.rect.minY = rect.minY;
    this.rect.minX = rect.minX;
    this.rect.maxY = rect.maxY;
    this.rect.maxX = rect.maxX;

    this.layoutFlags |= 0x1;

    this.onFrameSizeChanged(prevRect);

    return this.layoutFlags & 0x1;
  }

  onFrameSizeChanged(_prevRect: Rect) {
    for (const node of this.resizeList) {
      node.frame.resize(false);
    }
  }

  registerResize(frame: LayoutFrame, changed: number) {
    for (const node of this.resizeList) {
      if (node.frame === frame) {
        node.changed |= changed;
        return;
      }
    }

    const node = new FrameNode(frame, changed);
    this.resizeList.linkToTail(node);

    // TODO: Set protected layout flags (0x400 and 0x200)
  }

  resize(force = false) {
    const { resizePendingList } = LayoutFrame;

    // TODO: Constantize layout flags
    if (force && !(this.layoutFlags & 0x8) && this.onFrameResize()) {
      resizePendingList.unlink(this);
      return;
    }

    if (this.layoutFlags & 0x4 && (this.layoutFlags & 0x2 || resizePendingList.isLinked(this))) {
      this.resizeCounter = 6;
      return;
    }

    this.layoutFlags |= 0x4;

    if (this.layoutFlags & 0x2) {
      for (const node of this.resizeList) {
        node.frame.resize(false);
      }
    } else {
      this.addToResizeList();
    }
  }

  setAllPoints(relative: LayoutFrame | null, resize = false) {
    if (!relative || !relative.canBeAnchorFor(this)) {
      return;
    }

    this.freePoints();

    let topLeft = this.points[FramePointType.TOPLEFT];
    if (topLeft) {
      topLeft.setRelative(relative, FramePointType.TOPLEFT, 0, 0);
    } else {
      topLeft = new FramePoint(relative, FramePointType.TOPLEFT, 0, 0);
      this.points[FramePointType.TOPLEFT] = topLeft;
    }

    let bottomRight = this.points[FramePointType.BOTTOMRIGHT];
    if (bottomRight) {
      bottomRight.setRelative(relative, FramePointType.BOTTOMRIGHT, 0, 0);
    } else {
      bottomRight = new FramePoint(relative, FramePointType.BOTTOMRIGHT, 0, 0);
      this.points[FramePointType.BOTTOMRIGHT] = bottomRight;
    }

    this.layoutFlags &= ~0x8;

    const changed = (1 << FramePointType.TOPLEFT) | (1 << FramePointType.BOTTOMRIGHT);
    relative.registerResize(this, changed);

    if (resize) {
      this.resize(false);
    }
  }

  setPoint(pointType: FramePointType, relative: LayoutFrame | null, relativePointType: FramePointType, offsetX = 0, offsetY = 0, resize = false) {
    if (!relative || !relative.canBeAnchorFor(this)) {
      return;
    }

    let framePoint = this.points[pointType];
    if (framePoint) {
      if (framePoint.relative) {
        if (relative === framePoint.relative) {
          if (
            framePoint.type !== relativePointType
            || !areClose(framePoint.offset.x, offsetX, EPSILON1)
            || !areClose(framePoint.offset.y, offsetY, EPSILON1)
          ) {
            framePoint.setRelative(relative, relativePointType, offsetX, offsetY);

            if (resize) {
              this.resize(false);
            }
          }

          return;
        } else {
          framePoint.relative.unregisterResize(this, 1 << pointType);
        }
      }

      framePoint.setRelative(relative, relativePointType, offsetX, offsetY);
    } else {
      framePoint = new FramePoint(relative, relativePointType, offsetX, offsetY);
      this.points[pointType] = framePoint;
    }

    this.layoutFlags &= ~0x8;
    relative.registerResize(this, 1 << pointType);

    if (resize) {
      this.resize(false);
    }
  }

  unregisterResize(_frame: LayoutFrame, _dep: number) {
    // TODO: Implementation
  }

  static resizePending() {
    const { resizePendingList } = this;

    for (const frame of resizePendingList) {
      // TODO: Is object loaded check
      if (frame.onFrameResize() || --frame.resizeCounter === 0) {
        frame.layoutFlags &= ~0x4;
        resizePendingList.unlink(frame);
      }
    }
  }
}

export default LayoutFrame;
