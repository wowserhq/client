import DrawLayerType from '../../../gfx/DrawLayerType';
import Region from './Region';

class Texture extends Region {
  postLoadXML(node) {
    // TODO
  }

  static fromXMLNode(node, frame) {
    const texture = new this(frame, DrawLayerType.ARTWORK, true);
    texture.preLoadXML(node);
    texture.loadXML(node);
    texture.postLoadXML(node);
    return texture;
  }
}

export default Texture;
