import * as scriptFunctions from './script';

class UIContext {
  constructor(client) {
    this.client = client;

    this.client.script.registerFunctions(scriptFunctions);
  }
}

export default UIContext;
