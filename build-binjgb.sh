#!/bin/bash

cd binjgb
make wasm
cp out/Wasm/binjgb.* ../www/wasm/
