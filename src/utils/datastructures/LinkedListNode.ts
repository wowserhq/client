import LinkedListLink from './LinkedListLink';

class LinkedListNode {
  link: LinkedListLink<this>;

  constructor() {
    this.link = LinkedListLink.for(this);
  }
}

export default LinkedListNode;
