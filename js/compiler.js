"use strict";

this.compiler = new Object();
(function(compiler) {
    var busy = false;
    var repeat = false;
    var start_delay_timer;
    var done_callback;
    var log_callback;
    var error_list = [];
    var rom_symbols = [];
    var ram_symbols = [];
    var link_options = [];

    var line_nr_regex = /([\w\.]+)[\w\.\:~]*\(([0-9]+)\)/gi;

    var buffered_log = "";
    function logFunction(str) {
        if(/^[^:\s]+:/.test(str)) {
            // If the log starts with a label, we can emit the previously buffered one.
            flushLog();
            buffered_log = str.trim();
        } else {
            // If the log doesn’t start with a label, it’s a follow-up to the previous log,
            // so add it to the buffer.
            buffered_log += " " + str.trim();
        }
    }

    function flushLog() {
        unbufferedLogFunction(buffered_log);
        buffered_log = "";
    }

    function unbufferedLogFunction(str) {
        if (log_callback)
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
    
    compiler.getRomSymbols = function() {
        return rom_symbols
    }

    compiler.getRamSymbols = function() {
        return ram_symbols
    }
    
    compiler.setLinkOptions = function(options) {
        link_options = options;
    }
    
    function trigger()
    {
        if (typeof(start_delay_timer) != "undefined")
            clearTimeout(start_delay_timer);
        start_delay_timer = setTimeout(startCompile, 500);
    }
    
    function startCompile()
    {
        if (log_callback)
            log_callback(null);
        error_list = [];
        rom_symbols = [];
        ram_symbols = [];
        
        var targets = [];
        for (const name of Object.keys(storage.getFiles()))
            if (name.endsWith(".asm"))
                targets.push(name);
        runRgbAsm(targets, {});
    }
    
    function runRgbAsm(targets, obj_files) {
        var target = targets.pop();
        logFunction("Running: rgbasm " + target + ' -o ' + target + '.o -Wall');
        createRgbAsm({
            'arguments': [target, '-o', 'output.o', '-Wall'],
            'preRun': function(m) {
                var FS = m.FS;
                for (const [key, value] of Object.entries(storage.getFiles())) {
                    FS.writeFile(key, value);
                }
            },
            'print': logFunction, 'printErr': logFunction,
        }).then(function(m) {
            flushLog();
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
        var args = ['-o', 'output.gb', '--map', 'output.map'].concat(link_options);
        for(var name in obj_files)
            args.push(name + ".o");
        logFunction("Running: rgblink " + args.join(" "));
        createRgbLink({
            'arguments': args,
            'preRun': function(m) {
                var FS = m.FS;
                for(var name in obj_files)
                    FS.writeFile(name + ".o", obj_files[name]);
            },
            'print': logFunction, 'printErr': logFunction,
        }).then(function(m) {
            flushLog();
            if (repeat) { buildFailed(); return; }
            var FS = m.FS;
            try { var rom_file = FS.readFile("output.gb"); } catch { buildFailed(); return; }
            try { var map_file = FS.readFile("output.map", {'encoding': 'utf8'}); } catch { buildFailed(); return; }
            
            runRgbFix(rom_file, map_file);
            //buildDone(rom_file, map_file);
        });
    }

    function runRgbFix(input_rom_file, map_file) {
        logFunction("Running: rgbfix -v output.gb -p 0xff");
        createRgbFix({
            'arguments': ['-v', 'output.gb', '-p', '0xff'],
            'preRun': function(m) {
                var FS = m.FS;
                FS.writeFile("output.gb", input_rom_file);
            },
            'print': logFunction, 'printErr': logFunction,
        }).then(function(m) {
            flushLog();
            var FS = m.FS;
            try { var rom_file = FS.readFile("output.gb"); } catch { buildFailed(); return; }
            
            buildDone(rom_file, map_file);
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

    function buildDone(rom_file, map_file) {
        if (repeat) {
            repeat = false;
            trigger();
        } else {
            busy = false;

            var start_address = 0x100;
            var addr_to_line = {}
            var sym_re = /^\s*\$([0-9a-f]+) = ([\w\.]+)/;
            var section_type_bank_re = /^\s*(\w+) bank #(\d+)/;
            var section_re = /^\s*SECTION: \$([0-9a-f]+)-\$([0-9a-f]+)/;
            var slack_re = /^\s*SLACK: \$([0-9a-f]+) bytes/;
            
            var section_type = "";
            var section_name = "";
            var bank_nr = 0;
            for(var line of map_file.split("\n"))
            {
                var m;
                if (m = sym_re.exec(line))
                {
                    var addr = parseInt(m[1], 16);
                    var sym = m[2];
                    
                    if (sym.startsWith("__SEC_"))
                    {
                        sym = sym.substr(6);
                        var file = sym.substr(sym.indexOf("_") + 1);
                        file = file.substr(file.indexOf("_") + 1);
                        var line_nr = parseInt(sym.split("_")[1], 16);
                        addr = (addr & 0x3FFF) | (bank_nr << 14);
                        addr_to_line[addr] = [file, line_nr];
                    } else if (sym == "emustart" || sym == "emuStart" || sym == "emu_start") {
                        start_address = addr;
                    } else if (addr < 0x8000)
                    {
                        addr = (addr & 0x3fff) | (bank_nr << 14);
                        rom_symbols[addr] = sym
                    } else {
                        ram_symbols[addr] = sym
                    }
                } else if (m = section_re.exec(line)) {
                    var start_addr = parseInt(m[1], 16);
                    var end_addr = parseInt(m[2], 16) + 1;
                    if (start_addr < 0x8000)
                    {
                        start_addr = (start_addr & 0x3fff) | (bank_nr << 14);
                        end_addr = (end_addr & 0x3fff) | (bank_nr << 14);
                        rom_symbols[start_addr] = null;
                        rom_symbols[end_addr] = null;
                    } else {
                        ram_symbols[start_addr] = null;
                        ram_symbols[end_addr] = null;
                    }
                } else if (m = section_type_bank_re.exec(line)) {
                    section_type = m[1];
                    bank_nr = parseInt(m[2]);
                } else if (m = slack_re.exec(line)) {
                    var space = parseInt(m[1], 16);
                    var total = 0x4000;
                    if (section_type.startsWith("WRAM"))
                        total = 0x1000;
                    else if (section_type.startsWith("HRAM"))
                        total = 127;
                    logFunction("Space left: " + section_type + "[" + bank_nr + "]: " + space + "  (" + (space / total * 100).toFixed(1) + "%)");
                }
            }
            logFunction("Build done");
            flushLog();
            done_callback(rom_file, start_address, addr_to_line);
        }
    }
})(this.compiler);
