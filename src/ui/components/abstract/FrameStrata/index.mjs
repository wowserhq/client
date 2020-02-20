import FrameStrataType from './Type';
import FrameStrataLevel from './Level';

class FrameStrata {
  constructor(type) {
    this.type = type;
    this.levels = [];

    // TODO: Should these be booleans?
    this.levelsDirty = 0;
    this.batchDirty = 0;
  }

  get name() {
    const lookup = Object.keys(FrameStrataType);
    const name = lookup[this.type];
    return name;
  }

  get topLevel() {
    return this.levels.length;
  }

  addFrame(frame) {
    const { topLevel } = this;
    if (frame.level >= topLevel) {
      for (let index = topLevel; index < frame.level + 1; ++index) {
        const level = new FrameStrataLevel(index);
        this.levels[index] = level;
      }
    }

    const level = this.levels[frame.level];

    if (!frame.strataLink.isLinked) {
      const frames = level.pendingFrame ? level.pendingFrames : level.frames;
      frames.add(frame);

      if (!(frame.flags & 0x2000)) {
        level.batchDirty = -1;
      }
    }

    this.levelsDirty = 1;
    this.batchDirty |= (level.batchDirty !== 0);
  }

  onLayerUpdate(elapsedSecs) {
    for (const level of this.levels) {
      level.onLayerUpdate(elapsedSecs);
    }
  }

  onLayerRender() {
    for (const level of this.levels) {
      for (const batch of level.renderBatches) {
        // TODO: Render actual batch
        console.log('rendering batch', batch);
      }
    }
  }
}

export default FrameStrata;
export { FrameStrataType };
