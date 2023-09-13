#!/bin/bash

set -eu

if [[ "$(which emsdk)" == "" ]]; then
    echo "I need emscripten sdk active, see https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

cd binjgb
patch -p1 < ../binjgb.patch
make wasm EMSCRIPTEN_DIR=${EMSDK}/upstream/emscripten
mkdir -p ../www/wasm
cp out/Wasm/binjgb.* ../www/wasm/
