import { LinkedList, LinkedListNode } from '../../utils';

import EventType from './EventType';
import FrameScriptObject from './FrameScriptObject';

class EventListenerNode extends LinkedListNode {
  listener: FrameScriptObject;

  constructor(listener: FrameScriptObject) {
    super();

    this.listener = listener;
  }
}

class EventEmitter {
  type: EventType;
  listeners: LinkedList<EventListenerNode>;
  unregisterListeners: LinkedList<EventListenerNode>;
  registerListeners: LinkedList<EventListenerNode>;
  signalCount: number;
  pendingSignalCount: number;

  constructor(type: EventType) {
    this.type = type;
    this.listeners = LinkedList.using('link');
    this.unregisterListeners = LinkedList.using('link');
    this.registerListeners = LinkedList.using('link');
    this.signalCount = 0;
    this.pendingSignalCount = 0;
  }

  get name() {
    return this.type;
  }
}

export default EventEmitter;
export { EventListenerNode };
