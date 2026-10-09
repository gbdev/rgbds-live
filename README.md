# rgbds-live

A live RGBDS programming environment in the browser, allowing for realtime assembly programming for the Game Boy. Powered by webassembly builds of [RGBDS](https://rgbds.gbdev.io/) and the [Binjgb](https://github.com/binji/binjgb) emulator.

Try online at [gbdev.io/rgbds-live](https://gbdev.io/rgbds-live/).

## Local file upload

The `rgbds-live` npm package provides a CLI tool that lets you upload your local Game Boy assembly project files directly from your terminal to the web IDE, bypassing the URL hash size limit (2 KB).

### Install

```bash
npm install -g rgbds-live
```

### Usage

```bash
# Upload all .asm and .inc files in the current directory
rgbds-live

# Upload a specific file and auto-detect its INCLUDE/INCBIN dependencies
rgbds-live main.asm

# Upload multiple files
rgbds-live main.asm data.inc
```

This will start a local HTTP server on your machine and automatically open the web IDE at [gbdev.io/rgbds-live](https://gbdev.io/rgbds-live/), with your local files loaded directly into the editor. There is no file size limit since the data stays on your local machine.


### Development

For local testing without deploying to GitHub, use the `--dev` flag to connect to a local Vite dev server:

```bash
# Terminal 1: Start the Vite dev server (from the rgbds-live repo)
npm run dev

# Terminal 2: Start the CLI with --dev flag
cd /path/to/your/project

# Option A: If you've installed the package locally
rgbds-live --dev main.asm

# Option B: Run directly with Node.js (no installation needed)
node /path/to/rgbds-live/cli.js --dev main.asm
```

## Build

System requirements:

- bison, cmake
- [emscripten](https://emscripten.org/docs/getting_started/downloads.html) working with 4.0.8 (you can change version with `emsdk install 4.0.8 && emsdk activate 4.0.8`)
- on windows prefered way is to install: cmake, msys2 (pacman -S bison flex)

Make sure you initialize submodules to be able to build the WebAssembly modules:

```bash
# Pull RGBDS-live, rgbds and binjgb sources
git clone https://github.com/gbdev/rgbds-live --recursive
```

then

```bash
# Do a full build
./build.sh
```

or alternatively(or on windows):
```bash
npm ci
emcmake cmake -B build
cmake --build build
```

To start hacking, use the development server:

```bash
# Development server with live refresh:
npm run dev
```
