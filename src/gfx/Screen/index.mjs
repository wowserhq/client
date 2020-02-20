import { LinkedList, LinkStrategy } from '../../utils';

import ScreenLayer from './Layer';

class Screen {
  constructor() {
    this.constructor.instance = this;

    this.element = null;
    this.layers = LinkedList.of(ScreenLayer, 'zorderLink');

    this.render = this.render.bind(this);

    // TODO: Continuously render screen, not on click
    document.addEventListener('click', this.render);
  }

  getViewport() {
    return this;
  }

  setViewport(..._viewport) {
    // TODO: Set viewport
  }

  attach(element) {
    this.element = element;

    // TODO: Initial render
    // requestAnimationFrame(this.render);
  }

  detach() {
    this.element = null;
  }

  render() {
    if (!this.element) {
      return;
    }

    console.group('render');

    // TODO: Base rect

    for (const layer of this.layers) {
      const { visibleRect, rect } = layer;
      visibleRect.left = Math.max(visibleRect.left, rect.left);
      visibleRect.bottom = Math.max(visibleRect.bottom, rect.bottom);
      visibleRect.right = Math.max(visibleRect.right, rect.right);
      visibleRect.top = Math.max(visibleRect.top, rect.top);

      // TODO: Combinatory magic with base rect
    }

    const _viewport = this.viewport;

    for (const layer of this.layers) {
      const { visibleRect } = layer;
      if (visibleRect.right <= visibleRect.left) {
        continue;
      }
      if (visibleRect.top <= visibleRect.bottom) {
        continue;
      }

      if (layer.flags & 0x4) {
        this.setViewport(0, 1, 0, 1, 0, 1);
      } else {
        this.setViewport(...visibleRect.args, 0, 1);
      }

      if (layer.flags & 0x2) {
        // TODO: Ortho projection
      }

      // TODO: Calculate elapsed time
      const elapsedSecs = 0;
      layer.render(layer.param, layer.rect, layer.visibleRect, elapsedSecs);
    }

    console.groupEnd('render');

    // TODO: Render again
    // requestAnimationFrame(this.render);
  }

  createLayer(...args) {
    const layer = new ScreenLayer(...args);
    this.addLayer(layer);
    return layer;
  }

  addLayer(layer) {
    const { zorder } = layer;

    let target = this.layers.head;
    while (target && zorder < target.zorder) {
      target = target.zorderLink.next.entity;
    }

    this.layers.link(layer, LinkStrategy.BEFORE, target);
  }
}

export default Screen;
