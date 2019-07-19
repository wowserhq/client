import Client from './Client';

const client = new Client();


(async () => {
  console.time('Client load time');

  await client.ui.load('Interface\\GlueXML\\GlueXML.toc');
  // await client.ui.load('Interface\\FrameXML\\FrameXML.toc');

  console.timeLog('Client load time', client);
})();

client.screen.attach(document.querySelector('canvas'));
