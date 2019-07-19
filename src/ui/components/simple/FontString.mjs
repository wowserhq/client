import DrawLayerType from '../../../gfx/DrawLayerType';
import Region from './Region';

// TODO: Multi inherit from both Region and Fontable
class FontString extends Region {
  postLoadXML(node) {
    // TODO
  }

  static fromXMLNode(node, frame) {
    const fontString = new this(frame, DrawLayerType.ARTWORK, true);
    fontString.preLoadXML(node);
    fontString.loadXML(node);
    fontString.postLoadXML(node);
    return fontString;
  }
}

export default FontString;
