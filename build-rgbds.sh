#!/bin/bash

set -eu

if [[ "$(which emmake)" == "" ]]; then
    echo "I need emscripten sdk active, see https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

cd rgbds

patch -p1 < ../rgbds.patch
echo "Allowing patching"
read
git diff > ../rgbds.patch

MAKE_ARGS="Q= PNGCFLAGS= PNGLDFLAGS= PNGLDLIBS="
CFLAGS="-O3 -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=['FS'] -s USE_LIBPNG"
emmake make ${MAKE_ARGS} CFLAGS="${CFLAGS} -s 'EXPORT_NAME=createRgbAsm'" rgbasm
emmake make ${MAKE_ARGS} CFLAGS="${CFLAGS} -s 'EXPORT_NAME=createRgbLink'" rgblink
emmake make ${MAKE_ARGS} CFLAGS="${CFLAGS} -s 'EXPORT_NAME=createRgbFix'" rgbfix
mkdir -p ../www/wasm/
cp rgbasm* ../www/wasm/
cp rgblink* ../www/wasm/
cp rgbfix* ../www/wasm/
