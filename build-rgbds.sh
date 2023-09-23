#!/bin/bash

set -eu

if [[ "$(which emmake)" == "" ]]; then
    echo "I need emscripten sdk active, see https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

cd rgbds

patch -p1 < ../rgbds.patch


MAKE_ARGS="Q= PNGCFLAGS= PNGLDFLAGS= PNGLDLIBS="
CFLAGS="-O3 -s EXPORT_ES6=1 -s ENVIRONMENT=web -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=['FS'] -s USE_LIBPNG"
emmake make ${MAKE_ARGS} CFLAGS="${CFLAGS} -s 'EXPORT_NAME=createRgbAsm'" rgbasm
emmake make ${MAKE_ARGS} CFLAGS="${CFLAGS} -s 'EXPORT_NAME=createRgbLink'" rgblink
emmake make ${MAKE_ARGS} CFLAGS="${CFLAGS} -s 'EXPORT_NAME=createRgbFix'" rgbfix
