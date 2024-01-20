/* eslint-disable no-console, import/prefer-default-export */

const INFO = 0x0;
const WARNING = 0x1;
const ERROR = 0x2;
const FATAL = 0x3;

class Status {
  constructor() {
    this.entries = [];
  }

  add(type, ...args) {
    this.entries.push([type, ...args]);
  }

  info(...args) {
    console.info(...args);
    this.add(INFO, ...args);
  }

  warning(...args) {
    console.warn(...args);
    this.add(WARNING, ...args);
  }

  error(...args) {
    console.error(...args);
    this.add(ERROR, ...args);
  }

  fatal(...args) {
    console.error(...args);
    this.add(FATAL, ...args);
  }
}

export { Status };
