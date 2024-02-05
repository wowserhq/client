import RenderBatch from '../../rendering/RenderBatch';
import XMLNode from '../../XMLNode';

import Region from './Region';

import * as scriptFunctions from './FontString.script';

// TODO: Multi inherit from both Region and Fontable
class FontString extends Region {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  postLoadXML(_node: XMLNode) {
    // TODO
  }

  draw(_batch: RenderBatch) {
    // TODO
  }
}

export default FontString;
