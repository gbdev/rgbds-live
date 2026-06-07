#!/bin/bash

set -eu

if [[ "$(which emsdk)" == "" ]]; then
    echo "I need emscripten sdk active, see https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

[ -d build ] || emcmake cmake -B build
# Only update node_modules if older than the package file.
if ! [[ -d node_modules && package.json -ot node_modules ]]; then
    npm ci
    touch node_modules
fi

cmake --build build
npm run build

