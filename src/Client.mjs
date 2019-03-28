import ScriptContext from './script/Context';
import UIContext from './ui/Context';
import { fetch } from './utils';

class Client {
  constructor() {
    this.script = new ScriptContext(this);
    this.fetch = fetch;

    this.ui = new UIContext(this);
  }
}

export default Client;
