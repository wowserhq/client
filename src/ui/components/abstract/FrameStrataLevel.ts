import DrawLayerType from '../../DrawLayerType';
import Frame from '../simple/Frame';
import RenderBatch from '../../rendering/RenderBatch';
import { LinkedList } from '../../../utils';

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

    this.renderList = LinkedList.of(RenderBatch, 'renderLink');
  }

  removeFrame(frame) {
    if (!this.frames.isLinked(frame)) {
      return 0;
    }

    if (frame === this.pendingFrame) {
      this.pendingFrame = this.frames.linkFor(frame).next;
    }

    this.frames.unlink(frame);

    // TODO: Constantize frame flag
    if (!(frame.flags & 0x2000)) {
      this.batchDirty = -1;
    }

    return this.batchDirty !== 0;
  }

  prepareRenderBatches() {
    // let { batchDirty } = this;
    // batchDirty = 0xFF;

    const { batchDirty } = this;
    if (!batchDirty) {
      return 0;
    }

    this.batchDirty = 0;

    for (const batch of this.batches) {
      this.renderList.unlink(batch);

      if ((1 << batch.drawLayerType) & batchDirty) {
        batch.clear();

        for (const frame of this.frames) {
          // TODO: Constantize frame flag
          if (!(frame.flags & 0x2000)) {
            frame.onFrameRender(batch);
          }
        }

        batch.finish();
      }

      if (batch.count) {
        this.renderList.linkToTail(batch);
      }
    }

    // TODO: Constantize these flags
    if (this.batchDirty & 0x20) {
      this.batchDirty |= 0x1F;
    }

    return 0;
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
