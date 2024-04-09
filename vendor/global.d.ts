// Ensures `import file from './file.lua'` does not trip up TypeScript compiler
declare module '*.lua?raw' {
  const format: string;
  export default format;
}
