"use strict";

this.compiler = new Object();
(function(compiler) {
    var busy = false;
    var repeat = false;
    var start_delay_timer;
    var done_callback;
    var log_callback;
    var error_list = [];

    var line_nr_regex = /([\w\.]+)[\w\.\:]*\(([0-9]+)\)/gi;

    function logFunction(str) {
        log_callback(str);

        if (str.startsWith("error: ") || str.startsWith("ERROR: ") || str.startsWith("warning: "))
        {
            var type = "error";
            if (str.startsWith("warning: "))
                type = "warning";

            var line_nr_match = str.matchAll(line_nr_regex);
            for(var m of line_nr_match)
            {
                var error_line = parseInt(m[2]);
                error_list.push([type, m[1], error_line, str]);
            }
        }
    }

    compiler.setLogCallback = function(callback) {
        log_callback = callback;
    }
    
    compiler.compile = function(callback) {
        done_callback = callback;
        if (busy) {
            repeat = true;
        } else {
            busy = true;
            trigger();
        }
    }
    
    compiler.getErrors = function() {
        return error_list;
    }
    
    function trigger()
    {
        if (typeof(start_delay_timer) != "undefined")
            clearTimeout(start_delay_timer);
        start_delay_timer = setTimeout(startCompile, 500);
    }
    
    function startCompile()
    {
        log_callback(null);
        error_list = [];
        
        var targets = [];
        for (const name of Object.keys(storage.getFiles()))
            if (name.endsWith(".asm"))
                targets.push(name);
        runRgbAsm(targets, {});
    }
    
    function runRgbAsm(targets, obj_files) {
        var target = targets.pop();
        logFunction("Running rgbasm: " + target);
        createRgbAsm({
            'arguments': [target, '-o', 'output.o', '-e', '-Wall'],
            'preRun': function(m) {
                var FS = m.FS;
                for (const [key, value] of Object.entries(storage.getFiles())) {
                    FS.writeFile(key, value);
                }
            },
            'print': logFunction, 'printErr': logFunction,
        }).then(function(m) {
            if (repeat) { buildFailed(); return; }
            var FS = m.FS;
            try { var obj_file = FS.readFile("output.o"); } catch { buildFailed(); return; }
            obj_files[target] = obj_file;
            if (targets.length > 0)
                runRgbAsm(targets, obj_files);
            else
                runRgbLink(obj_files);
        });
    }

    function runRgbLink(obj_files) {
        logFunction("Running rgblink");
        var args = ['-o', 'output.gb', '--sym', 'output.sym']
        for(var name in obj_files)
            args.push(name + ".o");
        createRgbLink({
            'arguments': args,
            'preRun': function(m) {
                var FS = m.FS;
                for(var name in obj_files)
                    FS.writeFile(name + ".o", obj_files[name]);
            },
            'print': logFunction, 'printErr': logFunction,
        }).then(function(m) {
            if (repeat) { buildFailed(); return; }
            var FS = m.FS;
            try { var rom_file = FS.readFile("output.gb"); } catch { buildFailed(); return; }
            try { var sym_file = FS.readFile("output.sym", {'encoding': 'utf8'}); } catch { buildFailed(); return; }
            
            runRgbFix(rom_file, sym_file);
            //buildDone(rom_file, sym_file);
        });
    }

    function runRgbFix(input_rom_file, sym_file) {
        logFunction("Running rgbfix");
        createRgbFix({
            'arguments': ['-v', 'output.gb'],
            'preRun': function(m) {
                var FS = m.FS;
                FS.writeFile("output.gb", input_rom_file);
            },
            'print': logFunction, 'printErr': logFunction,
        }).then(function(m) {
            var FS = m.FS;
            try { var rom_file = FS.readFile("output.gb"); } catch { buildFailed(); return; }
            
            buildDone(rom_file, sym_file);
        });
    }

    function buildFailed() {
        logFunction("Build failed");
        if (repeat) {
            repeat = false;
            trigger();
        } else {
            busy = false;
            done_callback();
        }
    }

    function buildDone(rom_file, sym_file) {
        if (repeat) {
            repeat = false;
            trigger();
        } else {
            busy = false;

            var start_address = 0x100;
            var addr_to_line = {}
            for(var line of sym_file.split("\n"))
            {
                if (line.indexOf("__SEC_") > -1)
                {
                    var sym = line.substr(line.indexOf("__SEC_") + 6);
                    var file = sym.substr(sym.indexOf("_") + 1);
                    file = file.substr(file.indexOf("_") + 1).replace("#", ".");
                    var line_nr = parseInt(sym.split("_")[1], 16);
                    var addr = line.split(" ")[0].split(":");
                    addr = (parseInt(addr[0], 16) * 0x4000) | (parseInt(addr[1], 16) & 0x3FFF)
                    addr_to_line[addr] = [file, line_nr];
                }
                else if (line.endsWith(" emustart") || line.endsWith(" emuStart") || line.endsWith(" emu_start"))
                {
                    var addr = line.split(" ")[0].split(":");
                    addr = (parseInt(addr[0], 16) * 0x4000) | (parseInt(addr[1], 16) & 0x3FFF)
                    start_address = addr;
                }
            }
            logFunction("Build done");
            done_callback(rom_file, start_address, addr_to_line);
        }
    }
})(this.compiler);
