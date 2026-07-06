import ace from './ace/loader.js';
import * as compiler from './compiler.js';
import * as storage from './storage.js';
import * as main from './main.js';
import './ace/mode-sm83.js';

ace.config.set('basePath', `assets/ace`);

import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { TokenTooltip } from './ace/sm83tooltip.js';
import { sm83Completer } from './ace/complete-sm83.js';

var editors = [];
var current_file = null;
var errors = {};
var cpu_line_filename = null;
var cpu_line_line_nr = null;
var cpu_line_marker = null;
var breakpoints = [];
var cursor_position_per_file = {};

const runColorMode = (fn) => {
  if (!window.matchMedia) {
    return;
  }
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  fn(query.matches);
  query.addEventListener('change', (event) => fn(event.matches));
};

export function register(div_id, compileCode) {
  var e = ace.edit(div_id);
  new TokenTooltip(e);
  runColorMode((isDarkMode) => {
    e.setTheme(isDarkMode ? 'ace/theme/tomorrow_night_eighties' : 'ace/theme/tomorrow');
  });
  e.session.setMode('ace/mode/sm83');
  e.setOptions({
    tabSize: 2,
    useSoftTabs: true,
    navigateWithinSoftTabs: true,
    enableBasicAutocompletion: true,
    enableSnippets: true,
  });

  // Live autocomplete (auto-popup) disabled by default; toggle via View menu checkbox
  // Basic completion (Ctrl+Space) is always available
  e.setOption('enableLiveAutocompletion', false);

  e.session.on('change', function (delta) {
    if (e.curOp && e.curOp.command.name) {
      storage.update(current_file, e.getValue());
      compileCode();
    }
  });
  e.on('guttermousedown', function (event) {
    var target = event.domEvent.target;

    if (target.className.indexOf('ace_gutter-cell') == -1) return;
    var row = event.getDocumentPosition().row;
    toggleBreakpoint(current_file, row + 1);
    event.stop();
  });

  // Font size control via keyboard shortcuts (Ctrl+=/-, Ctrl+0) and View menu buttons
  // The variable of font size is saved in the local storage with limit 8 to 32.
  // It is implemented through ACE editor functions
  (function () {
    var DEFAULT_SIZE = 14;
    var MIN_SIZE = 8;
    var MAX_SIZE = 32;
    var STORAGE_KEY = 'aceFontSize';

    var currentSize = parseInt(localStorage.getItem(STORAGE_KEY)) || DEFAULT_SIZE;
    e.setFontSize(currentSize + 'px');

    function applyFontSize(size) {
      e.setFontSize(size + 'px');
      var display = document.getElementById('view_font_size_display');
      if (display) display.textContent = size;
    }

    window.changeEditorFontSize = function (delta) {
      var newSize = currentSize + delta;
      if (newSize < MIN_SIZE || newSize > MAX_SIZE) return;
      currentSize = newSize;
      applyFontSize(currentSize);
      localStorage.setItem(STORAGE_KEY, currentSize);
    };

    // Initialize display
    applyFontSize(currentSize);

    e.commands.addCommand({
      name: 'increaseFontSize',
      bindKey: { win: 'Ctrl-=', mac: 'Command-=' },
      exec: function () {
        window.changeEditorFontSize(1);
      },
    });

    e.commands.addCommand({
      name: 'decreaseFontSize',
      bindKey: { win: 'Ctrl--', mac: 'Command--' },
      exec: function () {
        window.changeEditorFontSize(-1);
      },
    });

    e.commands.addCommand({
      name: 'resetFontSize',
      bindKey: { win: 'Ctrl-0', mac: 'Command-0' },
      exec: function () {
        currentSize = DEFAULT_SIZE;
        applyFontSize(currentSize);
        localStorage.setItem(STORAGE_KEY, currentSize);
      },
    });
  })();

  // Bind View menu buttons
  (function () {
    var decrBtn = document.getElementById('view_font_decrease');
    var incrBtn = document.getElementById('view_font_increase');
    if (decrBtn) decrBtn.addEventListener('click', function () { window.changeEditorFontSize(-1); });
    if (incrBtn) incrBtn.addEventListener('click', function () { window.changeEditorFontSize(1); });
  })();

  // Bind Options menu: "Enable autocomplete" checkbox (default: off)
  (function () {
    var cb = document.getElementById('view_enable_autocomplete');
    if (cb) {
      cb.checked = localStorage.getItem('enableAutocomplete') === 'true';
      e.setOption('enableLiveAutocompletion', cb.checked);
      cb.addEventListener('change', function () {
        localStorage.setItem('enableAutocomplete', cb.checked);
        e.setOption('enableLiveAutocompletion', cb.checked);
      });
    }
  })();

  editors.push(e);
}

export function setCurrentFile(filename) {
  if (current_file != null) cursor_position_per_file[current_file] = editors[0].selection.getCursor();
  current_file = filename;
  editors[0].setValue(storage.getFiles()[filename]);
  editors[0].selection.clearSelection();
  editors[0].session.getUndoManager().reset();
  if (current_file in cursor_position_per_file)
    editors[0].selection.moveCursorToPosition(cursor_position_per_file[current_file]);
  else editors[0].selection.moveCursorTo(0, 0);
  editors[0].scrollToLine(editors[0].selection.getCursor().row, true);
  editors[0].focus();
  updateErrors();
  updateCpuLine();
}

export function updateErrors() {
  var annotations = [];
  for (var [type, filename, line_nr, message] of compiler.getErrors()) {
    if (filename != current_file) continue;
    annotations.push({
      row: line_nr - 1,
      column: 0,
      type: type,
      text: message,
    });
  }
  editors[0].session.setAnnotations(annotations);
}

export function setCpuLine(filename, line_nr, scroll_to_line) {
  cpu_line_filename = filename;
  cpu_line_line_nr = line_nr;
  updateCpuLine(scroll_to_line);
}

function addBreakpoint(filename, line_nr) {
  breakpoints.push([filename, line_nr]);
  main.updateBreakpoints();
  updateBreakpoints();
}

function removeBreakpoint(filename, line_nr) {
  breakpoints = breakpoints.filter((data) => data[0] != filename || data[1] != line_nr);
  main.updateBreakpoints();
  updateBreakpoints();
}

function toggleBreakpoint(filename, line_nr) {
  var idx = breakpoints.findIndex((data) => data[0] == filename && data[1] == line_nr);
  if (idx > -1) removeBreakpoint(filename, line_nr);
  else addBreakpoint(filename, line_nr);
}

function updateBreakpoints() {
  editors[0].session.clearBreakpoints();
  for (var [filename, line_nr, valid] of breakpoints) {
    if (filename == current_file)
      editors[0].session.setBreakpoint(line_nr - 1, valid ? 'ace_breakpoint' : 'ace_invalid_breakpoint');
  }
}

function updateCpuLine(scroll_to_line) {
  if (scroll_to_line && current_file != null && current_file != cpu_line_filename) setCurrentFile(cpu_line_filename);

  if (cpu_line_marker != null) {
    editors[0].session.removeMarker(cpu_line_marker);
    cpu_line_marker = null;
  }

  if (cpu_line_filename == current_file) {
    cpu_line_marker = editors[0].session.addMarker(
      new ace.Range(cpu_line_line_nr - 1, 0, cpu_line_line_nr - 1, 1),
      'cpuLineMarker',
      'fullLine',
    );
    if (scroll_to_line) editors[0].scrollToLine(cpu_line_line_nr - 1, true, false, function () {});
  }
}

export function getCurrentFilename() {
  return current_file;
}

export function getBreakpoints() {
  return breakpoints;
}

export function gotoLine(line_nr) {
  //The line of ace start with 1
  editors[0].gotoLine(line_nr, 0, true);
  //Forced center display
  editors[0].scrollToLine(line_nr - 1, true, true, function() {});
  editors[0].focus();
}

export function hide() {
  editors[0].renderer.getContainerElement().style.display = 'none';
}

export function show() {
  editors[0].renderer.getContainerElement().style.display = '';
  editors[0].resize();
  editors[0].renderer.updateFull();
}
