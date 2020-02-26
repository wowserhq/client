import Frame from '../Frame';
import Script from '../../../scripting/Script';

import * as scriptFunctions from './script';

class EditBox extends Frame {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  constructor(...args) {
    super(...args);

    this.scripts.register(
      new Script('OnEnterPressed'),
      new Script('OnEscapePressed'),
      new Script('OnSpacePressed'),
      new Script('OnTabPressed'),
      new Script('OnTextChanged', ['userInput']),
      new Script('OnTextSet'),
      new Script('OnCursorChanged', ['x', 'y', 'w', 'h']),
      new Script('OnInputLanguageChanged', ['language']),
      new Script('OnEditFocusGained'),
      new Script('OnEditFocusLost'),
      new Script('OnCharComposition', ['text']),
    );
  }
}

export default EditBox;
