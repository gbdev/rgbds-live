#!/bin/sh

set -eu

rm -rf rgbds
git clone https://github.com/rednex/rgbds.git
cd rgbds
MAKE_ARGS="Q= PNGCFLAGS= PNGLDFLAGS= PNGLDLIBS="
CFLAGS="-O3 -s MODULARIZE=1 -s EXTRA_EXPORTED_RUNTIME_METHODS=['FS'] -s USE_LIBPNG"
emmake make ${MAKE_ARGS} CFLAGS="${CFLAGS} -s 'EXPORT_NAME=createRgbAsm'" rgbasm
emmake make ${MAKE_ARGS} CFLAGS="${CFLAGS} -s 'EXPORT_NAME=createRgbLink'" rgblink
emmake make ${MAKE_ARGS} CFLAGS="${CFLAGS} -s 'EXPORT_NAME=createRgbFix'" rgbfix
cp rgbasm* ../www
cp rgblink* ../www
cp rgbfix* ../www
