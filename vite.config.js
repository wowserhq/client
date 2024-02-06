import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // Ensure non-existent files produce 404s
  appType: 'mpa',
  assetsInclude: ['**/*.lua'],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/wowser-client-[hash].js',
      },
    },
  },
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
  // Do not include local game files into a production build
  publicDir: command === 'build' ? false : 'public'
}));
