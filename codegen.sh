#!/bin/bash

set -eu

cd www
# Generate hardware.inc.js
echo "var hardware_inc = String.raw\`" > js/hardware.inc.js
cat starting_project/hardware.inc | sed -r "s/\`/\$\{\'\`\'}/g" >> js/hardware.inc.js
echo "\`;" >> js/hardware.inc.js
