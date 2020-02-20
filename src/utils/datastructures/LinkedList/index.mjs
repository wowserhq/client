import LinkedListLink from './Link';

const LinkStrategy = {
  BEFORE: 1,
  AFTER: 2,
};

class LinkedList {
  constructor(type, propertyName = 'link') {
    this.type = type;
    this.propertyName = propertyName;

    this.sentinel = new LinkedListLink();
    this.sentinel.next = this.sentinel;
    this.sentinel.prev = this.sentinel;
  }

  get headLink() {
    return this.sentinel.next;
  }

  get head() {
    return this.headLink.entity;
  }

  get tailLink() {
    return this.sentinel.prev;
  }

  get tail() {
    return this.tailLink.entity;
  }

  get size() {
    let link = this.headLink;
    let count = 0;
    while (link !== this.sentinel) {
      count++;
      link = link.next;
    }
    return count;
  }

  add(entity) {
    this.linkToTail(entity);
  }

  linkToHead(entity) {
    this.link(entity, LinkStrategy.BEFORE, this.head);
  }

  linkToTail(entity) {
    this.link(entity, LinkStrategy.AFTER, this.tail);
  }

  linkFor(entity) {
    return entity[this.propertyName];
  }

  link(entity, strategy = LinkStrategy.BEFORE, other = null) {
    const link = this.linkFor(entity);
    if (link.isLinked) {
      link.unlink();
    }

    const target = (other && this.linkFor(other)) || this.sentinel;

    switch (strategy) {
      case LinkStrategy.BEFORE:
        const prev = target.prev;
        prev.next = link;
        link.prev = prev;
        link.next = target;
        target.prev = link;
        break;
      case LinkStrategy.AFTER:
        const next = target.next;
        next.prev = link;
        link.next = next;
        link.prev = target;
        target.next = link;
        break;
      default:
        throw new Error(`Invalid link strategy: ${strategy}`);
    }
  }

  [Symbol.iterator]() {
    const { sentinel } = this;
    return {
      link: sentinel,
      next() {
        this.link = this.link.next;
        return { value: this.link.entity, done: this.link === sentinel };
      },
    };
  }

  static of(type, propertyName = 'link') {
    return new this(type, propertyName);
  }
}

export default LinkedList;
export { LinkStrategy };
