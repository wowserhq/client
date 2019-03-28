import { multipleClasses } from '../../../utils';

import LayoutFrame from './LayoutFrame';
import ScriptObject from './ScriptObject';

class ScriptRegion extends multipleClasses(ScriptObject, LayoutFrame) {
  constructor(ui) {
    super([ui], [ui]);
  }

  get protectedFunctionsAllowed() {
    // TODO: Implementation
    return true;
  }
}

export default ScriptRegion;
