import { HashMap, HashStrategy } from '../../utils';

import Script from './Script';

// TODO: Add generic constraint to allow only relevant scripts
class ScriptRegistry extends HashMap<string, Script> {
  constructor() {
    super(HashStrategy.UPPERCASE);
  }

  register(...scripts: Script[]) {
    for (const script of scripts) {
      this.set(script.name, script);
    }
  }
}

export default ScriptRegistry;
