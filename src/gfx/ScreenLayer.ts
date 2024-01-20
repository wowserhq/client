import { LinkedListLink } from '../utils';
import { EdgeRect } from '../math';

class ScreenLayer {
  constructor(rect, zorder, flags, param, render) {
    this.rect = rect || new EdgeRect({ right: 1, top: 1 });
    this.zorder = zorder || 0.0;
    this.flags = flags || 0;
    this.param = param;
    this.render = render;

    this.zorderLink = new LinkedListLink(this);

    this.visibleRect = new EdgeRect();
  }
}

export default ScreenLayer;
