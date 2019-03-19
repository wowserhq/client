import Scripting from './Scripting';
import UI from './UI';

class Client {
  constructor() {
    this.scripting = new Scripting(this);
    this.ui = new UI();
  }
}

export default Client;
