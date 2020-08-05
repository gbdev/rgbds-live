"use strict";

(function(global) {
    var files = {"hardware.inc": hardware_inc, "main.asm": `
INCLUDE "hardware.inc"

SECTION "entry", ROM0[$100]
  jp start

SECTION "main", ROM0[$150]
start:
  nop
haltLoop:
  halt
  jr haltLoop
`};

    class Storage {
        update(name, code) {
            if (code === null)
                delete files[name]
            else
                files[name] = code;
            this.autoSave(name, code);
        }
        
        getFiles() {
            return files;
        }
        
        autoSave(name) {
        }
    
        save() {
        }
        
        load() {
        }
    }
    
    class HashStorage extends Storage {
        autoSave(name, code) {
            console.assert(name == "main.asm", "Hash storage can only store main.asm");
            if (name == "main.asm")
                location.hash = LZString.compressToEncodedURIComponent(code);
        }

        load() {
            if (location.hash.length > 1) {
                var code = LZString.decompressFromEncodedURIComponent(location.hash.slice(1));
                if (code != null)
                    files["main.asm"] = code;
            }
        }
    }

    class LocalStorageStorage extends Storage {
        autoSave(name, code) {
            if (code === null)
                delete localStorage["rgbds_storage_" + name]
            else
                localStorage["rgbds_storage_" + name] = code
        }

        load() {
            
        }
    }
    
    global.storage = new HashStorage()
})(this);