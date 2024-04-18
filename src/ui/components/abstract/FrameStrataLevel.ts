import DrawLayerType from '../../DrawLayerType';
import Frame from '../simple/Frame';
import RenderBatch from '../../rendering/RenderBatch';
import { EnumRecord, LinkedList, enumRecordFor } from '../../../utils';

class FrameStrataLevel {
  index: number;
  pendingFrames: LinkedList<Frame>;
  frames: LinkedList<Frame>;
  pendingFrame?: Frame;
  batches: EnumRecord<DrawLayerType, RenderBatch>;
  batchDirty: number;
  renderList: LinkedList<RenderBatch>;

  constructor(index: number) {
    this.index = index;

    // TODO: Can these two linked lists use the same property safely?
    this.pendingFrames = LinkedList.using('strataLink');
    this.frames = LinkedList.using('strataLink');

    this.batches = enumRecordFor(DrawLayerType, (type) => new RenderBatch(type));

    this.batchDirty = 0;

    this.renderList = LinkedList.using('renderLink');
  }

  removeFrame(frame: Frame) {
    if (!this.frames.isLinked(frame)) {
      return false;
    }

    if (frame === this.pendingFrame) {
      this.pendingFrame = this.frames.linkFor(frame).next?.entity;
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

  onLayerUpdate(elapsedSecs: number) {
    let frame = this.frames.head;
    while (frame) {
      const next = frame.strataLink.next?.entity;
      this.pendingFrame = next;
      frame.onLayerUpdate(elapsedSecs);
      frame = this.pendingFrame;
    }
  }
}

export default FrameStrataLevel;
