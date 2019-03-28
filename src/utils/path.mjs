// Utility to deal with Blizzard's use of backslashes in paths

const SEPARATOR = '\\';

const dirname = (path) => {
  return path.slice(0, path.lastIndexOf(SEPARATOR));
};

const join = (...segments) => {
  return segments.join(SEPARATOR);
};

const normalize = (path) => {
  const segments = [];

  const parts = path.split(SEPARATOR);
  for (const part of parts) {
    if (!part || part === '.') {
      continue;
    }

    if (part === '..') {
      segments.pop();
    }

    segments.push(part);
  }

  return join(...segments);
};

export default {
  SEPARATOR,
  dirname,
  join,
  normalize,
};
