#!/bin/bash

set -eu

if [[ "$(which emsdk)" == "" ]]; then
    echo "I need emscripten sdk active, see https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

cd binjgb

! mkdir out
cd out
cmake -E env LDFLAGS='-s EXPORT_ES6=1 -s EXPORTED_RUNTIME_METHODS=['HEAP8']' \
    cmake \
        -DCMAKE_TOOLCHAIN_FILE=${EMSDK}/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake \
        -DCMAKE_BUILD_TYPE=Release \
        -DWERROR=ON \
        -DWASM=true \
        -DRGBDS_LIVE=ON \
        ../
make
