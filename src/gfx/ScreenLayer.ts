import { LinkedListLink } from '../utils';
import { EdgeRect } from '../math';

type ScreenRenderFn = (_param: null, _rect: EdgeRect, _visible: EdgeRect, _elapsedSecs: number) => void;

class ScreenLayer {
  rect: EdgeRect;
  zorder: number;
  flags: number;
  param: null;
  render: ScreenRenderFn;
  zorderLink: LinkedListLink<ScreenLayer>;
  visibleRect: EdgeRect;

  constructor(rect: EdgeRect | null, zorder: number, flags: number, param: null, render: ScreenRenderFn) {
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
