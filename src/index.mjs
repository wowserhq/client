import Client from './Client';
import { Button, Frame } from './ui/components';

const client = new Client();

console.log('Lift off!', client);


(async () => {
  await client.ui.load('Interface\\GlueXML\\GlueXML.toc');
  console.log('Done!');
})();
