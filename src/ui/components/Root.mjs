import Screen from '../../gfx/Screen';
import { LinkedList, NDCtoDDCWidth, NDCtoDDCHeight } from '../../utils';

import Frame, { FrameFlag } from './simple/Frame';
import FramePointType from './abstract/FramePoint';
import FrameStrata, { FrameStrataType } from './abstract/FrameStrata';
import LayoutFrame from './abstract/LayoutFrame';

class Root extends LayoutFrame {
  constructor() {
    super();

    this.constructor.instance = this;

    this.layout = {
      frame: null,
      anchor: FramePointType.TOPLEFT,
    };

    this.strata = Object.values(FrameStrataType).map(type => (
      new FrameStrata(type)
    ));

    this.frames = LinkedList.of(Frame, 'framesLink');
    this.destroyedFrames = LinkedList.of(Frame, 'destroyedLink');

    this.rect.maxX = NDCtoDDCWidth(1);
    this.rect.maxY = NDCtoDDCHeight(1);

    // TODO: Is this frame flag constant correct?
    this.layoutFlags |= FrameFlag.TOPLEVEL;

    this.onPaintScreen = this.onPaintScreen.bind(this);

    this.screenLayer = Screen.instance.createLayer(
      null, 1.0, 0x4, null, this.onPaintScreen,
    );
  }

  register(frame) {
    this.frames.add(frame);
  }

  showFrame(frame) {
    this.strata[frame.strataType].addFrame(frame);
    // TODO: Register for events
  }

  hideFrame(frame, _unknownBool) {
    if (this.layout.frame === frame) {
      // Unflatten (?) current layout frame

      this.layout.frame = null;
      this.layout.anchor = FramePointType.TOPLEFT;
    }

    // TODO: Unregister for events
    this.strata[frame.strataType].removeFrame(frame);
  }

  raiseFrame(frame, _checkOcclusion) {
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

  notifyFrameLayerChanged(frame, drawLayerType) {
    const strata = this.strata[frame.strataType];
    const level = strata.levels[frame.level];
    level.batchDirty |= 1 << drawLayerType;
    strata.batchDirty = 1;
  }

  onLayerUpdate(elapsedSecs) {
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

  onPaintScreen(param, rect, visibleRect, elapsedSecs) {
    this.onLayerUpdate(elapsedSecs);
    this.onLayerRender();
  }
}

export default Root;
