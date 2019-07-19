import DrawLayerType from '../../../../gfx/DrawLayerType';
import Frame from '../../simple/Frame';
import RenderBatch from '../../../../gfx/RenderBatch';
import { LinkedList } from '../../../../utils';

class FrameStrataLevel {
  constructor(...args) {
    this.pendingFrames = LinkedList.of(Frame, 'strataLink');
    this.frames = LinkedList.of(Frame, 'strataLink');

    this.pendingFrame = null;

    this.batches = Object.values(DrawLayerType).map(type => (
      new RenderBatch(type)
    ));

    // TODO: Should this be a boolean?
    this.batchDirty = 0;

    this.renderBatches = LinkedList.of(RenderBatch, 'renderLink');
  }

  onLayerUpdate(elapsedSecs) {
    let frame = this.frames.head;
    while (frame) {
      const next = frame.strataLink.next.entity;
      this.pendingFrame = next;
      frame.onLayerUpdate(elapsedSecs);
      frame = this.pendingFrame;
    }
  }
}

export default FrameStrataLevel;
