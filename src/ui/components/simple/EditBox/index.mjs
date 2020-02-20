import Frame from '../Frame';
import Script from '../../../scripting/Script';

class EditBox extends Frame {
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
