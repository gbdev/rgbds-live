import * as ace from "ace/ace.js";
ace.config.set("basePath", `assets/ace`);
export default ace;

// This version of ACE doesn’t give me much of a choice than to put ace on a global.
globalThis.ace = ace;
import "ace/mode-coffee.js";
import "ace/theme-tomorrow.js";
import "ace-builds/src-noconflict/ext-language_tools";

// ace comes bundled and uses requireJS internally. So we can get access to some of the internal modules, this helper function taps into ace’s require function and turns it into a promise, analogous to import().
export function require(path) {
  return new Promise((resolve, reject) => {
    ace.require([path], (mod) => {
      if (!mod) reject(Error(`Could not load ${path}`));
      resolve(mod);
    });
  });
}
