# rgbds-live

A live RGBDS programming environment in the browser, allowing for realtime assembly programming for the Game Boy. Powered by webassembly builds of [RGBDS](https://rgbds.gbdev.io/) and the [Binjgb](https://github.com/binji/binjgb) emulator.

Try online at [gbdev.io/rgbds-live](https://gbdev.io/rgbds-live/).

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
