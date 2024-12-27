#!/bin/bash

set -eu

if [[ "$(which emmake)" == "" ]]; then
    echo "I need emscripten sdk active, see https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

cd rgbds

patch -p1 < ../patches/rgbds.patch


MAKE_ARGS="Q= PNGCFLAGS= PNGLDFLAGS= PNGLDLIBS="
CXXFLAGS="-O3 -flto -DNDEBUG -s USE_LIBPNG"
LDFLAGS="-s EXPORT_ES6=1 -s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT=web -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=['FS']"
emmake make ${MAKE_ARGS} CXXFLAGS="${CXXFLAGS}" LDFLAGS="${LDFLAGS} -s 'EXPORT_NAME=createRgbAsm'" rgbasm
emmake make ${MAKE_ARGS} CXXFLAGS="${CXXFLAGS}" LDFLAGS="${LDFLAGS} -s 'EXPORT_NAME=createRgbLink'" rgblink
emmake make ${MAKE_ARGS} CXXFLAGS="${CXXFLAGS}" LDFLAGS="${LDFLAGS} -s 'EXPORT_NAME=createRgbFix'" rgbfix
