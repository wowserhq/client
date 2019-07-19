import Client from './Client';
import * as glueScriptFunctions from './ui/scripting/globals/glue';

const client = new Client();

// TODO: Part of GlueMgr
client.ui.scripting.registerFunctions(glueScriptFunctions);

(async () => {
  console.time('Client load time');

  await client.ui.load('Interface\\GlueXML\\GlueXML.toc');
  // await client.ui.load('Interface\\FrameXML\\FrameXML.toc');

  console.timeLog('Client load time', client);
})();

client.screen.attach(document.querySelector('canvas'));
