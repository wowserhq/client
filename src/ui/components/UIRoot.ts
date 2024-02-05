import DrawLayerType from '../DrawLayerType';
import Screen from '../../gfx/Screen';
import ScreenLayer from '../../gfx/ScreenLayer';
import { EdgeRect } from '../../math';
import { LinkedList, NDCtoDDCWidth, NDCtoDDCHeight } from '../../utils';

import Frame, { FrameFlag } from './simple/Frame';
import FramePointType from './abstract/FramePointType';
import FrameStrata, { FrameStrataType } from './abstract/FrameStrata';
import LayoutFrame from './abstract/LayoutFrame';

class UIRoot extends LayoutFrame {
  static instance: UIRoot;

  layout: {
    frame: Frame | null,
    anchor: FramePointType
  };
  strata: Record<FrameStrataType, FrameStrata> & Iterable<FrameStrata>;
  frames: LinkedList<Frame>;
  destroyedFrames: LinkedList<Frame>;
  screenLayer: ScreenLayer;

  constructor() {
    super();

    UIRoot.instance = this;

    this.layout = {
      frame: null,
      anchor: FramePointType.TOPLEFT,
    };

    this.strata = [
      new FrameStrata(FrameStrataType.WORLD),
      new FrameStrata(FrameStrataType.BACKGROUND),
      new FrameStrata(FrameStrataType.LOW),
      new FrameStrata(FrameStrataType.MEDIUM),
      new FrameStrata(FrameStrataType.HIGH),
      new FrameStrata(FrameStrataType.DIALOG),
      new FrameStrata(FrameStrataType.FULLSCREEN),
      new FrameStrata(FrameStrataType.FULLSCREEN_DIALOG),
      new FrameStrata(FrameStrataType.TOOLTIP),
    ];

    this.frames = LinkedList.using('framesLink');
    this.destroyedFrames = LinkedList.using('destroyedLink');

    this.rect.maxX = NDCtoDDCWidth(1);
    this.rect.maxY = NDCtoDDCHeight(1);

    // TODO: Is this frame flag constant correct?
    this.layoutFlags |= FrameFlag.TOPLEVEL;

    this.onPaintScreen = this.onPaintScreen.bind(this);

    this.screenLayer = Screen.instance.createLayer(
      null, 1.0, 0x4, null, this.onPaintScreen,
    );
  }

  register(frame: Frame) {
    this.frames.add(frame);
  }

  showFrame(frame: Frame, _unknown: boolean) {
    this.strata[frame.strataType].addFrame(frame);
    // TODO: Register for events
  }

  hideFrame(frame: Frame, _unknown: boolean) {
    if (this.layout.frame === frame) {
      // Unflatten (?) current layout frame

      this.layout.frame = null;
      this.layout.anchor = FramePointType.TOPLEFT;
    }

    // TODO: Unregister for events
    this.strata[frame.strataType].removeFrame(frame);
  }

  raiseFrame(source: Frame, _checkOcclusion: boolean) {
    let frame: Frame | null = source;
    while (frame && frame.flags & FrameFlag.TOPLEVEL) {
      frame = frame.parent;
    }

    if (!frame) {
      return false;
    }

    // TODO: Occlusion

    if (frame.flags & FrameFlag.OCCLUDED) {
      // TODO: Strata compression
      // TODO: Check focus
      const strata = this.strata[frame.strataType];
      frame.setFrameLevel(strata.topLevel, true);
    }

    return true;
  }

  notifyFrameLayerChanged(frame: Frame, drawLayerType: DrawLayerType) {
    const strata = this.strata[frame.strataType];
    const level = strata.levels[frame.level];
    level.batchDirty |= 1 << drawLayerType;
    strata.batchDirty = 1;
  }

  onLayerUpdate(elapsedSecs: number) {
    // TODO: Clean-up destroyed frames

    console.log('root pre-render', this);

    LayoutFrame.resizePending();

    for (const strata of this.strata) {
      strata.onLayerUpdate(elapsedSecs);
    }

    LayoutFrame.resizePending();

    // TODO: Focus check
  }

  onLayerRender() {
    // TODO: Camera setup screen projection

    for (const strata of this.strata) {
      // TODO: Batch support
      strata.onLayerRender();
    }
  }

  onPaintScreen(_param: null, _rect: EdgeRect, _visibleRect: EdgeRect, elapsedSecs: number) {
    this.onLayerUpdate(elapsedSecs);
    this.onLayerRender();
  }
}

export default UIRoot;
