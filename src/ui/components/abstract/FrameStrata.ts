import Frame from '../simple/Frame';
import UIContext from '../../UIContext';

import FrameStrataType from './FrameStrataType';
import FrameStrataLevel from './FrameStrataLevel';

class FrameStrata {
  type: FrameStrataType;
  levels: FrameStrataLevel[];
  levelsDirty: number;
  batchDirty: number;

  constructor(type: FrameStrataType) {
    this.type = type;
    this.levels = [];

    this.levelsDirty = 0;
    this.batchDirty = 0;
  }

  get name() {
    return FrameStrataType[this.type];
  }

  get topLevel() {
    return this.levels.length;
  }

  addFrame(frame: Frame) {
    const { topLevel } = this;
    if (frame.level >= topLevel) {
      for (let index = topLevel; index < frame.level + 1; ++index) {
        const level = new FrameStrataLevel(index);
        this.levels[index] = level;
      }
    }

    const level = this.levels[frame.level]!;

    console.debug(`adding ${frame.name} to strata ${frame.strataType} level ${frame.level}`);

    if (!frame.strataLink.isLinked) {
      const frames = level.pendingFrame ? level.pendingFrames : level.frames;
      frames.add(frame);

      // TODO: Constantize frame flag
      if (!(frame.flags & 0x2000)) {
        level.batchDirty = -1;
      }
    }

    this.levelsDirty = 1;
    this.batchDirty |= +(level.batchDirty !== 0);
  }

  removeFrame(frame: Frame) {
    if (frame.level < this.topLevel) {
      const level = this.levels[frame.level]!;
      const batchDirty = level.removeFrame(frame);
      this.batchDirty |= +batchDirty;
      this.levelsDirty = 1;
    }
  }

  prepareRenderBatches() {
    if (this.levelsDirty) {
      // TODO: Check occlusion
      this.levelsDirty = 0;
    }

    if (!this.batchDirty) {
      return this.batchDirty;
    }

    this.batchDirty = 0;

    if (this.topLevel === 0) {
      return 0;
    }

    for (const level of this.levels) {
      if (level.prepareRenderBatches()) {
        this.batchDirty = 1;
      }
    }

    return this.batchDirty;
  }

  onLayerUpdate(elapsedSecs: number) {
    for (const level of this.levels) {
      level.onLayerUpdate(elapsedSecs);
    }
  }

  onLayerRender() {
    const { renderer } = UIContext.instance;

    console.group(`strata ${this.type} (${this.name})`);

    this.prepareRenderBatches();

    for (const level of this.levels) {
      console.group(`level ${level.index}`);

      const frames = Array.from(level.frames);

      console.debug('frame names', frames.map((f) => f.name));
      console.debug('frames', frames);
      console.debug('render list', Array.from(level.renderList));

      for (const batch of level.renderList) {
        renderer.draw(batch);
      }

      console.groupEnd();
    }

    console.groupEnd();
  }
}

export default FrameStrata;
export { FrameStrataType };
