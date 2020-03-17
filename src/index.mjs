import Client from './Client';
import { ModelFFX } from './ui/components';
import * as glueScriptFunctions from './ui/scripting/globals/glue';

const client = new Client();

// TODO: Part of GlueMgr
client.ui.scripting.registerFunctions(glueScriptFunctions);
client.ui.factories.register('ModelFFX', ModelFFX);

(async () => {
  console.time('Client load time');

  await client.ui.load('Interface\\GlueXML\\GlueXML.toc');
  // await client.ui.load('Interface\\FrameXML\\FrameXML.toc');

  console.timeLog('Client load time', client);

  // TODO: Should be handled by GlueMgr
  client.ui.scripting.execute('SetGlueScreen("login")');

  client.screen.render();
})();

client.screen.attach(document.querySelector('canvas'));
