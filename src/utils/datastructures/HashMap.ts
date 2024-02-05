/* eslint-disable @typescript-eslint/no-explicit-any */

const HashStrategy = {
  IDENTITY: (key: any) => key,
  LOWERCASE: (key: string) => key.toLowerCase(),
  UPPERCASE: (key: string) => key.toUpperCase(),
} as const;

type HashKeyStrategyFn<K> = (_key: K) => K;

class HashMap<K extends string, V> extends Map<K, V> {
  strategy: HashKeyStrategyFn<K>;

  constructor(strategy = HashStrategy.IDENTITY) {
    super();

    this.strategy = strategy;
  }

  delete(origKey: K) {
    const key = this.strategy(origKey);
    return super.delete(key);
  }

  get(origKey: K) {
    const key = this.strategy(origKey);
    return super.get(key);
  }

  has(origKey: K) {
    const key = this.strategy(origKey);
    return super.has(key);
  }

  set(origKey: K, value: V) {
    const key = this.strategy(origKey);
    return super.set(key, value);
  }
}

export default HashMap;
export { HashStrategy };
