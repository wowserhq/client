import Frame from '../Frame';
import Script from '../../../scripting/Script';

class Button extends Frame {
  constructor(...args) {
    super(...args);

    this.scripts.register(
      new Script('PreClick', ['button', 'down']),
      new Script('OnClick', ['button', 'down']),
      new Script('PostClick', ['button', 'down']),
      new Script('OnDoubleClick', ['button']),
    );
  }
}

export default Button;
