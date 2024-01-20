/* eslint-disable import/prefer-default-export */

// Poor man's multi inheritance mechanism
// Note: Will most likely not work with complex hierarchies
// Inspiration: https://itnext.io/multiple-inheritance-in-js-part-2-24adca2c2518
const multipleClasses = (base, ...ctors) => {
  const cls = class extends base {
    constructor(baseArgs = [], ...ctorsArgs) {
      // Create an instance of the base class
      const instance = super(...baseArgs);

      // Construct temporary instances of all other classes and assign their
      // own properties to the instance
      for (const [index, ctor] of ctors.entries()) {
        Object.assign(instance, new ctor(...(ctorsArgs[index] || [])));
      }

      return instance;
    }
  };

  const { prototype } = cls;

  // Enhance the new class' prototype with all the methods, getters and setters
  // from all other classes
  for (const ctor of ctors) {
    const pds = Object.getOwnPropertyDescriptors(ctor.prototype);
    for (const [name, pd] of Object.entries(pds)) {
      if (name === 'constructor') {
        continue;
      }
      Object.defineProperty(prototype, name, pd);
    }
  }

  return cls;
};

export { multipleClasses };
