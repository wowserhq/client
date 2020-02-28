import Screen from '../../gfx/Screen';
import { LinkedList } from '../../utils';

import Frame, { FrameFlag } from './simple/Frame';
import FrameStrata, { FrameStrataType } from './abstract/FrameStrata';
import LayoutFrame, { LayoutFramePoint } from './abstract/LayoutFrame';

class Root extends LayoutFrame {
  constructor() {
    super();

    this.constructor.instance = this;

    this.layout = {
      frame: null,
      anchor: LayoutFramePoint.TOPLEFT,
    };

    this.strata = Object.values(FrameStrataType).map(type => (
      new FrameStrata(type)
    ));

    this.frames = LinkedList.of(Frame, 'framesLink');
    this.destroyedFrames = LinkedList.of(Frame, 'destroyedLink');

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
      this.layout.anchor = LayoutFramePoint.TOPLEFT;
    }

    // TODO: Unregister for events
    this.strata[frame.strataType].removeFrame(frame);
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
