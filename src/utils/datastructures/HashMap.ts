const HashStrategy = {
  IDENTITY: key => key,
  LOWERCASE: key => key.toLowerCase(),
  UPPERCASE: key => key.toUpperCase(),
};

class HashMap extends Map {
  constructor(strategy = HashStrategy.IDENTITY) {
    super();

    this.strategy = strategy;
  }

  delete(origKey) {
    const key = this.strategy(origKey);
    return super.delete(key);
  }

  get(origKey) {
    const key = this.strategy(origKey);
    return super.get(key);
  }

  has(origKey) {
    const key = this.strategy(origKey);
    return super.has(key);
  }

  set(origKey, value) {
    const key = this.strategy(origKey);
    return super.set(key, value);
  }
}

export default HashMap;
export { HashStrategy };
