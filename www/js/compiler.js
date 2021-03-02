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

    function logFunction(str) {
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
        
        var asm_targets = [];
        var c_targets = [];
        for (const name of Object.keys(storage.getFiles()))
        {
            if (name.endsWith(".asm"))
                asm_targets.push(name);
            if (name.endsWith(".c"))
                c_targets.push(name);
        }
        if (asm_targets.length > 0)
            runRgbAsm(asm_targets, {});
        if (c_targets.length > 0)
            runSdcc(c_targets, {});
    }

    function runSdcc(targets, obj_files) {
        var target = targets.pop();
        var code = storage.getFiles()[target];
        var preproc = ""
        logFunction("Running: sdcpp " + target);
        createSDCPP({
            'arguments': ['-nostdinc', '-Wall', '-std=c11', '-D__SDCC_STACK_AUTO', '-D__SDCC_CHAR_UNSIGNED', '-D__SDCC_INT_LONG_REENT', '-D__SDCC_FLOAT_REENT', '-D__SDCC=4_0_7', '-D__SDCC_VERSION_MAJOR=4', '-D__SDCC_VERSION_MINOR=0', '-D__SDCC_VERSION_PATCH=7', '-D__SDCC_REVISION=12060', '-D__SDCC_gbz80', '-D__STDC_NO_COMPLEX__=1', '-D__STDC_NO_THREADS__=1', '-D__STDC_NO_ATOMICS__=1', '-D__STDC_NO_VLA__=1', '-D__STDC_ISO_10646__=201409L', '-D__STDC_UTF_16__=1', '-D__STDC_UTF_32__=1', '-isystem', '/usr/local/share/sdcc/include/gbz80', '-isystem', '/usr/local/share/sdcc/include'],
            'stdin': function()
            {
                if (code == "") return null;
                var result = code.charCodeAt(0);
                code = code.substr(1);
                return result;
            },
            'print': function(output)
            {
                preproc += output + "\n";
            },
            'printErr': logFunction,
        }).then(function(sdcpp_module)
        {
            if (repeat) { buildFailed(); return; }
            logFunction("Running sdcc " + target);
            createSDCC({
                'arguments': ['--c1mode', '-o', 'out.asm'],
                'stdin': function()
                {
                    if (preproc == "") return null;
                    var result = preproc.charCodeAt(0);
                    preproc = preproc.substr(1);
                    return result;
                },
                'print': logFunction, 'printErr': logFunction,
            }).then(function(sdcc_module)
            {
                if (repeat) { buildFailed(); return; }
                var asm;
                try { asm = sdcc_module.FS.readFile("out.asm", {'encoding': 'utf8'}); } catch { buildFailed(); return; }

                //Parse the output asm
                var data = [];
                var line_nr = null;
                for(var line of (asm + "\n;<stdin>:-1").split("\n"))
                {
                    if (line.startsWith(";<stdin>:"))
                    {
                        if (line_nr !== null)
                        {
                            error_list.push(["info", target, line_nr, data.join("\n")]);
                        }
                        line_nr = parseInt(line.split(":")[1]);
                        data = [];
                    } else {
                        data.push(line.trim());
                    }
                }

                logFunction("Running sdas " + target);
                createSDAS({
                    'arguments': ['-plosgffw', 'main.rel', 'in.asm'],
                    'preRun': function(m) {
                        m.FS.writeFile("in.asm", asm);
                    },
                    'print': logFunction, 'printErr': logFunction,
                }).then(function(sdas_module)
                {
                    try { obj_files[target] = sdas_module.FS.readFile("main.rel"); } catch { buildFailed(); return; }
                    if (targets.length > 0)
                        runSdcc(targets, obj_files);
                    else
                        runSdccLink(obj_files);
                });
            });
        });
    }

    function runSdccLink(obj_files) {
        logFunction("Running sdldgb");
        var args = ['-nmjwx', '-i', 'main.ihx', '-b', '_CODE=0x0200', '-b', '_DATA=0xc000', '-k', '/usr/local/share/sdcc/lib/gbz80', '-l', 'gbz80', '/usr/local/share/sdcc/lib/gbz80/crt0.rel'];
        for(var name in obj_files)
            args.push(name + ".rel");
        createSDLD({
            'arguments': args,
            'preRun': [function(m) {
                for(var name in obj_files)
                    m.FS.writeFile(name + ".rel", obj_files[name]);
            }],
            'print': logFunction, 'printErr': logFunction,
        }).then(function(ld_module)
        {
            logFunction("Running makebin");
            try{ var hex = ld_module.FS.readFile("main.ihx", {'encoding': 'utf8'}); } catch { buildFailed(); return; }
            try{ var map = ld_module.FS.readFile("main.map", {'encoding': 'utf8'}); } catch { buildFailed(); return; }
            createMAKEBIN({
                'arguments': ['-yo', 'A', '-Z', 'main.ihx', 'main.gb'],
                'preRun': function(m) {
                    m.FS.writeFile('main.ihx', hex);
                }
            }).then(function(makebin_module) {
                var rom_file = makebin_module.FS.readFile('main.gb');
                buildDone(rom_file, "");

                var section_re = /([a-zA-Z0-9_]+) +([0-9A-F]+) +([0-9A-F]+) =/
                var symbol_re = /      ([0-9A-F]+)  ([a-zA-Z0-9_]+) +.+/
                var section_end = null;
                var symbols = rom_symbols;
                for(var line of map.split("\n"))
                {
                    var section_match = section_re.exec(line);
                    if (section_match)
                    {
                        section_end = parseInt(section_match[2], 16) + parseInt(section_match[3], 16)
                        symbols = rom_symbols;
                        if (section_match[1] == "_DATA")
                            symbols = ram_symbols;
                        if (!(section_end in symbols))
                            symbols[section_end] = null;
                    }
                    var symbol_match = symbol_re.exec(line);
                    if (symbol_match && section_end)
                    {
                        symbols[parseInt(symbol_match[1], 16)] = symbol_match[2];
                    }
                }
            });
        });
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
        logFunction("Running: " + args.join(" "));
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
            done_callback(rom_file, start_address, addr_to_line);
        }
    }
})(this.compiler);
