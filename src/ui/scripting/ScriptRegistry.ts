import { HashMap, HashStrategy } from '../../utils';

class ScriptRegistry extends HashMap {
  constructor() {
    super(HashStrategy.UPPERCASE);
  }

  register(...scripts) {
    for (const script of scripts) {
      this.set(script.name, script);
    }
  }
}

export default ScriptRegistry;
