import UIContext from './ui/Context';
import { fetch } from './utils';

class Client {
  constructor() {
    this.fetch = fetch;

    this.ui = new UIContext(this);
  }
}

export default Client;
