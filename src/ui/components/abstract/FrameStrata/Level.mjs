import DrawLayerType from '../../../DrawLayerType';
import Frame from '../../simple/Frame';
import RenderBatch from '../../../../gfx/RenderBatch';
import { LinkedList } from '../../../../utils';

class FrameStrataLevel {
  constructor(index) {
    this.index = index;

    this.pendingFrames = LinkedList.of(Frame, 'strataLink');
    this.frames = LinkedList.of(Frame, 'strataLink');

    this.pendingFrame = null;

    this.batches = Object.values(DrawLayerType).map(type => (
      new RenderBatch(type)
    ));

    this.batchDirty = 0;

    this.renderBatches = LinkedList.of(RenderBatch, 'renderLink');
  }

  removeFrame(frame) {
    if (!this.frames.linkFor(frame).isLinked) {
      return 0;
    }

    if (frame === this.pendingFrame) {
      this.pendingFrame = this.frames.linkFor(frame).next;
    }

    this.frames.linkFor(frame).unlink();

    // TODO: Constantize frame flag
    if (!(frame.flags & 0x2000)) {
      this.batchDirty = -1;
    }

    return this.batchDirty !== 0;
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
