import * as storage from './storage.js';

import createRgbAsm from '../build/out/rgbasm.js';
import createRgbLink from '../build/out/rgblink.js';
import createRgbFix from '../build/out/rgbfix.js';

var busy = false;
var repeat = false;
var start_delay_timer;
var done_callback;
var log_callback;
var error_list = [];
var rom_symbols = [];
var ram_symbols = [];
var asm_options = [];
var fix_options = [];
var link_options = [];

var last_error_type = 'error';
var last_error_message = '';
var line_nr_regex = /([\w\.]+)[\w\.\:~]*\(([0-9]+)\)/gi;

function logFunction(str, kind) {
  if (log_callback) log_callback(str, kind);

  if (kind == 'stderr') {
    var lower_str = str.toLowerCase();
    
    // recognize：warning / error / fatal / panic
    var has_warning = lower_str.includes('warning: ');
    var has_error = lower_str.includes('error: ') 
                 || lower_str.includes('fatal: ') 
                 || lower_str.includes('panic: ');
    
    // if there is an error or warning, update the last_error_type and last_error_message
    if (has_error || has_warning) {
      last_error_type = has_warning ? 'warning' : 'error';
      //extract the message after the error type for better error reporting, if possible
      const msgMatch = str.match(/(?:warning|error|fatal|panic): (.*)/i);
      last_error_message = msgMatch ? msgMatch[1] : str;
    }

    // extract line number and filename using regex
    var line_nr_match = str.matchAll(line_nr_regex);
    for (var m of line_nr_match) {
      var error_line = parseInt(m[2]);
      var filename = m[1];
      
      // bind the error to the corresponding file and line number
      // if the current line does not contain the error text (it's an "at" line), use the cached title message
      error_list.push([
        last_error_type, 
        filename, 
        error_line, 
        (has_error || has_warning) ? str : (last_error_message || str)
      ]);
    }
  }
}

function infoFunction(str) {
  logFunction(str, 'info');
}

function outFunction(str) {
  logFunction(str, 'stdout');
}

function errFunction(str) {
  logFunction(str, 'stderr');
}

export function setLogCallback(callback) {
  log_callback = callback;
}

export function compile(callback) {
  done_callback = callback;
  if (busy) {
    repeat = true;
  } else {
    busy = true;
    trigger();
  }
}

export function getErrors() {
  return error_list;
}

export function getRomSymbols() {
  return rom_symbols;
}

export function getRamSymbols() {
  return ram_symbols;
}

export function setAsmOptions(options) {
  asm_options = options;
}

export function setLinkOptions(options) {
  link_options = options;
}

export function setFixOptions(options) {
  fix_options = options;
}

function trigger() {
  if (typeof start_delay_timer != 'undefined') clearTimeout(start_delay_timer);
  start_delay_timer = setTimeout(startCompile, 500);
}

function startCompile() {
  if (log_callback) log_callback(null, null);
  error_list = [];
  last_error_type = 'error';//reset error type to default for new compilation
  last_error_message = ''; //clean up last error message for new compilation
  rom_symbols = [];
  ram_symbols = [];

  var targets = [];
  for (const name of Object.keys(storage.getFiles())) {
    if (name.endsWith('.asm')) targets.push(name);
  }
  runRgbAsm(targets, {});
}

function runRgbAsm(targets, obj_files) {
  var target = targets.pop();
  var args = ['-Wall', ...asm_options, '--color', 'never', '-o', 'output.o', '--', target];
  infoFunction('Running: rgbasm ' + args.join(' '));
  createRgbAsm({
    arguments: args,
    preRun: function (m) {
      var FS = m.FS;
      for (const [key, value] of Object.entries(storage.getFiles())) {
        FS.writeFile(key, value);
      }
    },
    print: outFunction,
    printErr: errFunction,
  }).then(function (m) {
    if (repeat) {
      buildFailed();
      return;
    }
    var FS = m.FS;
    try {
      var obj_file = FS.readFile('output.o');
    } catch {
      buildFailed();
      return;
    }
    obj_files[target] = obj_file;
    if (targets.length > 0) runRgbAsm(targets, obj_files);
    else runRgbLink(obj_files);
  });
}

function runRgbLink(obj_files) {
  var args = ['--color', 'never', '-o', 'output.gb', ...link_options, '-m', 'output.map', '--'];
  for (var name in obj_files) {
    args.push(name + '.o');
  }
  infoFunction('Running: rgblink ' + args.join(' '));
  createRgbLink({
    arguments: args,
    preRun: function (m) {
      var FS = m.FS;
      for (var name in obj_files) FS.writeFile(name + '.o', obj_files[name]);
    },
    print: outFunction,
    printErr: errFunction,
  }).then(function (m) {
    if (repeat) {
      buildFailed();
      return;
    }
    var FS = m.FS;
    try {
      var rom_file = FS.readFile('output.gb');
    } catch {
      buildFailed();
      return;
    }
    try {
      var map_file = FS.readFile('output.map', { encoding: 'utf8' });
    } catch {
      buildFailed();
      return;
    }

    runRgbFix(rom_file, map_file);
  });
}

function runRgbFix(input_rom_file, map_file) {
  var args = ['--color', 'never', '-p', '0xff', '-v', ...fix_options, '--', 'output.gb'];
  infoFunction('Running: rgbfix ' + args.join(' '));
  createRgbFix({
    arguments: args,
    preRun: function (m) {
      var FS = m.FS;
      FS.writeFile('output.gb', input_rom_file);
    },
    print: outFunction,
    printErr: errFunction,
  }).then(function (m) {
    var FS = m.FS;
    try {
      var rom_file = FS.readFile('output.gb');
    } catch {
      buildFailed();
      return;
    }

    buildDone(rom_file, map_file);
  });
}

function buildFailed() {
  infoFunction('Build failed');
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
    var addr_to_line = {};
    var sym_re = /^\s*\$([0-9a-f]+) = ([\w\.]+)/;
    var section_type_bank_re = /^\s*(\w+) bank #(\d+)/;
    var section_re = /^\s*SECTION: \$([0-9a-f]+)-\$([0-9a-f]+)/;
    var slack_re = /^\s*SLACK: \$([0-9a-f]+) bytes/;

    var section_type = '';
    var section_name = '';
    var bank_nr = 0;
    for (var line of map_file.split('\n')) {
      var m;
      if ((m = sym_re.exec(line))) {
        var addr = parseInt(m[1], 16);
        var sym = m[2];

        if (sym.startsWith('__SEC_')) {
          sym = sym.substr(6);
          var file = sym.substr(sym.indexOf('_') + 1);
          file = file.substr(file.indexOf('_') + 1);
          var line_nr = parseInt(sym.split('_')[1], 16);
          addr = (addr & 0x3fff) | (bank_nr << 14);
          addr_to_line[addr] = [file, line_nr];
        } else if (sym == 'emustart' || sym == 'emuStart' || sym == 'emu_start') {
          start_address = addr;
        } else if (addr < 0x8000) {
          addr = (addr & 0x3fff) | (bank_nr << 14);
          rom_symbols[addr] = sym;
        } else {
          ram_symbols[addr] = sym;
        }
      } else if ((m = section_re.exec(line))) {
        var start_addr = parseInt(m[1], 16);
        var end_addr = parseInt(m[2], 16) + 1;
        if (start_addr < 0x8000) {
          start_addr = (start_addr & 0x3fff) | (bank_nr << 14);
          end_addr = (end_addr & 0x3fff) | (bank_nr << 14);
          rom_symbols[start_addr] = null;
          rom_symbols[end_addr] = null;
        } else {
          ram_symbols[start_addr] = null;
          ram_symbols[end_addr] = null;
        }
      } else if ((m = section_type_bank_re.exec(line))) {
        section_type = m[1];
        bank_nr = parseInt(m[2]);
      } else if ((m = slack_re.exec(line))) {
        var space = parseInt(m[1], 16);
        var total = 0x4000;
        if (section_type.startsWith('WRAM')) total = 0x1000;
        else if (section_type.startsWith('HRAM')) total = 127;
        infoFunction(
          'Space left: ' +
            section_type +
            '[' +
            bank_nr +
            ']: ' +
            space +
            '  (' +
            ((space / total) * 100).toFixed(1) +
            '%)',
        );
      }
    }
    infoFunction('Build done');
    done_callback(rom_file, start_address, addr_to_line);
  }
}
