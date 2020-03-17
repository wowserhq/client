import { LinkedListLink } from '../../utils';

class RenderBatch {
  constructor(type) {
    this.type = type;

    this.renderLink = new LinkedListLink(this);
  }
}

export default RenderBatch;
