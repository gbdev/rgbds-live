# rgbds-live

A live RGBDS programming environment in the browser, allowing for realtime assembly programming for the Game Boy. Powered by webassembly builds of [RGBDS](https://rgbds.gbdev.io/) and the [Binjgb](https://github.com/binji/binjgb) emulator.

Try online at [gbdev.io/rgbds-live](https://gbdev.io/rgbds-live/).

## Build

System requirements:

- bison, cmake
- [emscripten](https://emscripten.org/docs/getting_started/downloads.html)

To build RGBDS live and run it locally:

```bash
# Pull RGBDS-live, rgbds and binjgb sources
git clone https://github.com/gbdev/rgbds-live --recursive
# Generate WASM builds and put them in the main source folder
./build.sh
```

Final build will be in `www/`. You can run the provided `serve-site.sh` to serve that folder locally over port 8080.
