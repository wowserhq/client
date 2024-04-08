# Wowser Client

[![Join Community](https://badgen.net/badge/discord/join%20community/blue)](https://discord.gg/DeVVKVg)
![Version](https://badgen.net/badge/npm/n%2Fa/gray)
[![MIT License](https://badgen.net/github/license/wowserhq/client)](LICENSE)
[![CI](https://github.com/wowserhq/client/workflows/CI/badge.svg)](https://github.com/wowserhq/client/actions?query=workflow%3ACI)
[![Test Coverage](https://codecov.io/gh/wowserhq/client/branch/master/graph/badge.svg)](https://codecov.io/gh/wowserhq/client)

World of Warcraft in the browser using JavaScript and WebGL.

This repository contains the web client.

## Background

Wowser is a proof-of-concept of getting a triple-A game to run in a webbrowser.

See the [Wowser] umbrella repository for more information.

## Status

This repository contains the Wowser web client, which currently has support for:

- Loading Blizzard UI files (`.toc`, `.xml` and `.lua`)
- Extremely primitive scene rendering using WebGL 2 (frames and textures mostly)
- GLSL ES 300 shaders and PNG textures (no BLP support yet)

**Note:** Only Wrath of the Lich King (3.3.5a) is currently supported. A copy of
the official client is required.

## Development

Wowser is written in [TypeScript] and developed with [vite].

1. Clone the repository:

   ```shell
   git clone git://github.com/wowserhq/wowser.git
   ```

2. Download and install [Node.js] 20+ for your platform.

3. Install dependencies:

   ```shell
   npm install
   ```

4. Extract interface files from the official Wrath of the Lich King client into
   the `public` folder, resulting in the following structure:

   ```
   public
     ├── Interface
     ├── Shaders
     └── Wowser
   ```

   In addition, convert BLP files to PNGs, using [BLPConverter].

   This entire step will be obsolete [soon™].

5. Run the dev server:

   ```shell
   npm run start:dev
   ```

   **Disclaimer:** Wowser serves up resources to the browser over HTTP. Depending
   on your network configuration these may be available to others. Respect laws and
   do not distribute game data you do not own.

## Contribution

When contributing, please:

- Fork the repository
- Open a pull request (preferably on a separate branch)

## License

Except where otherwise noted, Wowser Client is copyright © 2019-2024 Wowser Contributors. It is licensed
under the **MIT license**. See [`LICENSE`](LICENSE) for more information.

[BLPConverter]: https://github.com/wowserhq/blizzardry#blp
[ECMAScript modules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[Node.js]: http://nodejs.org/#download
[StormLib]: https://github.com/wowserhq/blizzardry#mpq
[TypeScript]: https://www.typescriptlang.org/
[Wowser]: https://github.com/wowserhq/wowser
[soon™]: http://www.wowwiki.com/Soon
[vite]: https://vitejs.dev/
