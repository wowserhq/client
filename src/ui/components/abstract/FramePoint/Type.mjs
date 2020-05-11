const FramePointType = {
  TOPLEFT: 0,
  TOP: 1,
  TOPRIGHT: 2,
  LEFT: 3,
  CENTER: 4,
  RIGHT: 5,
  BOTTOMLEFT: 6,
  BOTTOM: 7,
  BOTTOMRIGHT: 8,
};

export const stringToPointType = (str) => FramePointType[str.toUpperCase()];

export const FramePointTypeSide = {
  CENTERX: [
    FramePointType.TOP,
    FramePointType.CENTER,
    FramePointType.BOTTOM,
  ],
  CENTERY: [
    FramePointType.LEFT,
    FramePointType.CENTER,
    FramePointType.RIGHT,
  ],
  TOP: [
    FramePointType.TOPLEFT,
    FramePointType.TOP,
    FramePointType.TOPRIGHT,
  ],
  BOTTOM: [
    FramePointType.BOTTOMLEFT,
    FramePointType.BOTTOM,
    FramePointType.BOTTOMRIGHT,
  ],
  LEFT: [
    FramePointType.TOPLEFT,
    FramePointType.LEFT,
    FramePointType.BOTTOMLEFT,
  ],
  RIGHT: [
    FramePointType.TOPRIGHT,
    FramePointType.RIGHT,
    FramePointType.BOTTOMRIGHT,
  ],
};

export default FramePointType;
