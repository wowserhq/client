import Client from './Client';
import EventType from './ui/scripting/EventType';
import { ModelFFX } from './ui/components';
import * as glueScriptFunctions from './ui/scripting/globals/glue';

const params = new URLSearchParams(document.location.search);
const api = params.get('api') || 'webgl2';

const canvas = document.querySelector('canvas')!;
const client = new Client(canvas, { api });

// TODO: Part of GlueMgr
client.ui.scripting.registerFunctions(glueScriptFunctions);
client.ui.factories.register('ModelFFX', ModelFFX);

(async () => {
  console.time('Client load time');

  await client.ui.load('Wowser\\Wowser.toc');
  // await client.ui.load('Interface\\GlueXML\\GlueXML.toc');
  // await client.ui.load('Interface\\FrameXML\\FrameXML.toc');

  console.timeLog('Client load time');

  // TODO: Should be handled by GlueMgr
  client.ui.scripting.signalEvent(EventType.FRAMES_LOADED);
  client.ui.scripting.signalEvent(EventType.SET_GLUE_SCREEN, '%s', 'login');

  let last = new Date();
  const updateAndRender = () => {
    const now = new Date();
    const diff = +now - +last;

    client.ui.root.onLayerUpdate(diff);
    client.screen.render();

    last = now;
  };

  // Postpone rendering to allow resources to load (for now)
  setTimeout(updateAndRender, 1000);

  document.addEventListener('click', updateAndRender);
})();
