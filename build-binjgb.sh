#!/bin/bash

set -eu

if [[ "$(which emsdk)" == "" ]]; then
    echo "I need emscripten sdk active, see https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

cd binjgb

make wasm CMAKEFLAGS="-DRGBDS_LIVE=ON" EMSCRIPTEN_DIR=${EMSDK}/upstream/emscripten
mkdir -p ../www/wasm
cp out/Wasm/binjgb.* ../www/wasm/
