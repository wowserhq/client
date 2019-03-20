import ScriptContext from './script/Context';
import UIContext from './ui/Context';

class Client {
  constructor() {
    this.script = new ScriptContext(this);
    this.ui = new UIContext(this);
  }
}

export default Client;
