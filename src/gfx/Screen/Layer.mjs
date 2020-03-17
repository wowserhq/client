import { LinkedListLink } from '../../utils';
import { Rect } from '../../math';

class ScreenLayer {
  constructor(rect, zorder, flags, param, render) {
    this.rect = rect || new Rect(0, 0, 1, 1);
    this.zorder = zorder || 0.0;
    this.flags = flags || 0;
    this.param = param;
    this.render = render;

    this.zorderLink = new LinkedListLink(this);

    this.visibleRect = new Rect();
  }
}

export default ScreenLayer;
