/* eslint-disable @typescript-eslint/no-explicit-any, import/prefer-default-export */

type Constructor<T = object> = new (...args: any[]) => T;

// Poor man's multi inheritance mechanism (may break with complex hierarchies)
const multipleClasses = <
  B extends Constructor,
  O extends Constructor
>(base: B, other: O) => {
  type CombinedClassType = Constructor<InstanceType<B> & InstanceType<O>> & {
    // Statics for base
    [K in keyof B]: B[K]
  } & {
    // Statics for other
    [K in keyof O]: O[K]
  }

  const cls = class extends base {
    constructor(..._args: any[]) {
      // Create an instance of the base class
      super();

      // Construct temporary throw-away instance of other class and assign own properties
      // Warning: using `this` as a reference in other class' constructor will not work correctly
      Object.assign(this, new other());
    }
  } as unknown as CombinedClassType;

  const { prototype } = cls;

  // Handle instance methods, getters and setters from the other class
  let pds = Object.getOwnPropertyDescriptors(other.prototype);
  for (const [name, pd] of Object.entries(pds)) {
    // Skip over existing prototype entries
    if (name in prototype) {
      continue;
    }
    Object.defineProperty(prototype, name, pd);
  }

  // Handle statics from the other class
  pds = Object.getOwnPropertyDescriptors(other);
  for (const [name, pd] of Object.entries(pds)) {
    // Skip over existing static properties / methods
    if (name in cls) {
      continue;
    }
    Object.defineProperty(cls, name, pd);
  }

  return cls;
};

export { multipleClasses };
