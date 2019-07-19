import Screen from './gfx/Screen';
import UIContext from './ui/Context';
import { fetch } from './utils';

class Client {
  constructor() {
    this.fetch = fetch;

    this.screen = new Screen();
    this.ui = new UIContext(this);
  }
}

export default Client;
