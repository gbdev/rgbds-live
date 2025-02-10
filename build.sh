#!/bin/bash

set -eu

test -d binjgb/out || ./build-binjgb.sh
test -f rgbds/rgbasm.wasm || ./build-rgbds.sh

#store rgbds version tag for use in vite build
export VITE_RGBDS_VERSION=$(git --git-dir=rgbds/.git -c safe.directory='*' describe --tags --always)

npm ci
npm run build

