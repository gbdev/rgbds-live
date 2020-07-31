"use strict";

this.compiler = new Object();
(function(compiler) {
    var busy = false;
    var repeat = false;
    var done_callback;
    var log_callback;
    var error_callback;
    var input_file;

    var line_nr_regex = /.+\(([0-9]+)\)/i;

    function logFunction(str) {
        log_callback(str);

        if (str.startsWith("error: ") || str.startsWith("ERROR: ") || str.startsWith("warning: "))
        {
            var line_nr_match = line_nr_regex.exec(str);
            var error_line = parseInt(line_nr_match[1]);
            var type = "error";
            if (str.startsWith("warning: "))
                type = "warning";
            
            error_callback(type, error_line, str);
        }
    }

    compiler.setLogCallback = function(callback) {
        log_callback = callback;
    }
    
    compiler.setErrorCallback = function(callback) {
        error_callback = callback;
    }

    compiler.compile = function(code, callback) {
        input_file = code;
        done_callback = callback;
        if (busy) {
            repeat = true;
        } else {
            busy = true;
            runRgbAsm();
        }
    }
    
    function runRgbAsm() {
        logFunction("Running rgbasm");
        createRgbAsm({
            'arguments': ['input.asm', '-o', 'output.o', '-e'],
            'preRun': function(m) {
                var FS = m.FS;
                FS.writeFile("hardware.inc", hardware_inc);
                FS.writeFile("input.asm", input_file);
            },
            'print': logFunction, 'printErr': logFunction,
        }).then(function(m) {
            var FS = m.FS;
            try { var obj_file = FS.readFile("output.o"); } catch { buildFailed(); return; }
            runRgbLink(obj_file);
        });
    }
    
    function runRgbLink(obj_file) {
        logFunction("Running rgblink");
        createRgbLink({
            'arguments': ['input.o', '-o', 'output.gb', '-x', '--sym', 'output.sym'],
            'preRun': function(m) {
                var FS = m.FS;
                FS.writeFile("input.o", obj_file);
            },
            'print': logFunction, 'printErr': logFunction,
        }).then(function(m) {
            var FS = m.FS;
            try { var rom_file = FS.readFile("output.gb"); } catch { buildFailed(); return; }
            try { var sym_file = FS.readFile("output.sym", {'encoding': 'utf8'}); } catch { buildFailed(); return; }
            
            buildDone(rom_file, sym_file);
        });
    }
    
    function buildFailed() {
        if (repeat) {
            repeat = false;
            runRgbAsm();
        } else {
            busy = false;
            done_callback();
        }
    }
    
    function buildDone(rom_file, sym_file) {
        if (repeat) {
            repeat = false;
            runRgbAsm();
        } else {
            busy = false;

            var hex = Array.prototype.map.call(rom_file, x => ('00' + x.toString(16)).slice(-2)).join(' ');
            for(var n=0; n<hex.length; n+=3*32)
                logFunction(hex.slice(n, n + 3*32));
            
            var start_address = 0x100;
            var addr_to_line = {}
            for(var line of sym_file.split("\n"))
            {
                if (line.indexOf("__SECRET__") > -1 && line.indexOf("__LINE__") > -1)
                {
                    var line_nr = parseInt(line.split("__LINE__").pop(), 16);
                    var addr = line.split(" ")[0].split(":");
                    addr = (parseInt(addr[0], 16) * 0x4000) | (parseInt(addr[1], 16) & 0x3FFF)
                    addr_to_line[addr] = line_nr;
                }
                if (line.endsWith(" emustart") || line.endsWith(" emuStart") || line.endsWith(" emu_start"))
                {
                    var addr = line.split(" ")[0].split(":");
                    addr = (parseInt(addr[0], 16) * 0x4000) | (parseInt(addr[1], 16) & 0x3FFF)
                    start_address = addr;
                }
            }
            done_callback(rom_file, start_address, addr_to_line);
        }
    }
})(this.compiler);
