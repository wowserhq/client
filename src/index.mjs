import Client from './Client';
import { Button, Frame } from './ui/components';

const client = new Client();

console.log('Lift off!', client);

const frame = new Frame(null);
// const width = frame.m_width;

const button = new Button();

client.script.execute(
  `
  local frame1 = CreateFrame("FRAME", "TestFrame1", nil, nil, nil);
  print(frame1)
  -- local width = frame1:GetWidth();
  -- print(width);

  local frame2 = CreateFrame("FRAME", "TestFrame2", frame1, nil, nil);
  print(frame2);
  `,
  'frame.lua',
  0
);
