import LinkedListLink from './LinkedListLink';

const LinkStrategy = {
  AFTER: 1,
  BEFORE: 2,
};

class LinkedList<T> {
  propertyName: keyof T;

  sentinel: LinkedListLink<T>;

  constructor(propertyName: keyof T) {
    this.propertyName = propertyName;

    this.sentinel = new LinkedListLink();
    this.sentinel.next = this.sentinel;
    this.sentinel.prev = this.sentinel;
  }

  get headLink() {
    return this.sentinel.next;
  }

  get head() {
    return this.headLink?.entity;
  }

  get tailLink() {
    return this.sentinel.prev;
  }

  get tail() {
    return this.tailLink?.entity;
  }

  get size() {
    let link = this.headLink;
    let count = 0;
    while (link !== this.sentinel) {
      count++;
      link = link?.next ?? null;
    }
    return count;
  }

  add(entity: T) {
    this.linkToTail(entity);
  }

  isLinked(entity: T) {
    return this.linkFor(entity).isLinked;
  }

  linkToHead(entity: T) {
    this.link(entity, LinkStrategy.AFTER);
  }

  linkToTail(entity: T) {
    this.link(entity, LinkStrategy.BEFORE);
  }

  linkFor(entity: T): LinkedListLink<T> {
    return entity[this.propertyName] as LinkedListLink<T>;
  }

  link(entity: T, strategy = LinkStrategy.BEFORE, other?: T) {
    const link = this.linkFor(entity);
    if (link.isLinked) {
      link.unlink();
    }

    const target = (other && this.linkFor(other)) || this.sentinel;

    switch (strategy) {
      case LinkStrategy.BEFORE: {
        // From A - C, with target C, becomes A - B - C
        const prev = target.prev;
        if (prev) {
          prev.next = link;
        }
        link.prev = prev;
        link.next = target;
        target.prev = link;
      } break;
      case LinkStrategy.AFTER: {
        // From A - C, with target A, becomes A - B - C
        const next = target.next;
        if (next) {
          next.prev = link;
        }
        link.next = next;
        link.prev = target;
        target.next = link;
      } break;
      default:
        throw new Error(`Invalid link strategy: ${strategy}`);
    }
  }

  unlink(entity: T) {
    return this.linkFor(entity).unlink();
  }

  [Symbol.iterator]() {
    const { sentinel } = this;
    return {
      link: sentinel,
      next() {
        this.link = this.link?.next ?? this.link;
        return { value: this.link.entity!, done: this.link === sentinel };
      },
    };
  }

  static using<T>(propertyName: keyof T) {
    return new this<T>(propertyName);
  }
}

export default LinkedList;
export { LinkStrategy };
