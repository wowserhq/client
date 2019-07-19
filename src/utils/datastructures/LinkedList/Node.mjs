import LinkedListLink from './Link';

class LinkedListNode {
  constructor() {
    this.link = LinkedListLink.for(this);
  }
}

export default LinkedListNode;
