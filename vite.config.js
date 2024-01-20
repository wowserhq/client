import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.lua'],
  define: {
    // Configure Fengari to not suffix Lua integers with `.0` when string formatted
    // See: https://github.com/fengari-lua/fengari/issues/113
    'process.env.FENGARICONF': JSON.stringify(JSON.stringify({ LUA_COMPAT_FLOATSTRING: true })),
  },
  plugins: [
    {
      transform(src, id) {
        // Prevent Fengari from loading Node-only libraries
        // See: https://github.com/fengari-lua/fengari/blob/master/src/loslib.js#L480-L489
        if (id.includes('fengari')) {
          return {
            code: src.replaceAll('typeof process', JSON.stringify('undefined'))
          };
        }
      },
    },
  ],
});
