class LinkedListLink<T> {
  entity?: T;
  prev: LinkedListLink<T> | null;
  next: LinkedListLink<T> | null;

  constructor(entity?: T) {
    this.entity = entity;

    this.prev = null;
    this.next = null;
  }

  get isLinked() {
    return this.prev !== null || this.next !== null;
  }

  unlink() {
    if (this.prev) {
      this.prev.next = this.next;
    }

    if (this.next) {
      this.next.prev = this.prev;
    }

    this.prev = null;
    this.next = null;
  }

  static for<T>(entity: T) {
    return new this(entity);
  }
}

export default LinkedListLink;
