import LinkedListLink from './LinkedListLink';

class LinkedListNode {
  constructor() {
    this.link = LinkedListLink.for(this);
  }
}

export default LinkedListNode;
