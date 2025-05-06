import * as compiler from './compiler.js';
import * as emulator from './emulator.js';
import * as storage from './storage.js';
import * as editors from './editors.js';
import * as textEditor from './text-editor.js';
import * as gfxEditor from './gfx-editor.js';

globalThis.emulator = emulator;

if (import.meta.env.DEV) {
  globalThis._rgbdsDebug = {
    compiler,
    emulator,
    storage,
    editors,
    textEditor,
    gfxEditor,
  };
}

var cpu_line_marker = undefined;
var start_address;
var rom;
var addr_to_line = {};
var line_to_addr = {};
var cpu_step_interval_id;
var emu_view = '';

export function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function escapeHTML(str) {
  var escapedHTML = document.createElement('div');
  escapedHTML.innerText = str;
  return escapedHTML.innerHTML;
}

compiler.setLogCallback(function (str, kind) {
  var output = document.getElementById('output');
  if (str == null && kind == null) {
    output.innerHTML = '';
    return;
  }
  output.innerHTML += '<span class="' + kind + '">' + escapeHTML(str) + '</span>\n';
  output.scrollTop = output.scrollHeight;
});

const serial_log_buffer = [];
const serial_log_buffer_size = 256;
emulator.setSerialCallback(function (value) {
  var formatted_value = ('00' + value.toString(16)).slice(-2);
  document.getElementById('serial_log').innerText = '$' + formatted_value;
  serial_log_buffer.unshift(formatted_value);
  if (serial_log_buffer.length > serial_log_buffer_size) {
    serial_log_buffer.length = serial_log_buffer_size;
  }
});

export function compileCode() {
  compiler.compile(function (_rom_file, _start_address, _addr_to_line) {
    textEditor.updateErrors();
    updateFileList();

    var pc_line;
    destroyEmulator();
    if (typeof _rom_file == 'undefined') {
      return;
    }

    rom = _rom_file;
    start_address = _start_address;
    addr_to_line = _addr_to_line;
    for (var addr in addr_to_line) {
      var [filename, line] = addr_to_line[addr];
      if (typeof line_to_addr[filename] == 'undefined') line_to_addr[filename] = {};
      if (typeof line_to_addr[filename][line] == 'undefined') line_to_addr[filename][line] = [];
      line_to_addr[filename][line].push(addr);
    }
    updateTextView();
  });
}

function destroyEmulator() {
  emulator.destroy();

  addr_to_line = {};
  line_to_addr = {};
  rom = undefined;

  textEditor.setCpuLine(null, null);
}

function initEmulator(jump_to_pc) {
  if (typeof rom == 'undefined') return;

  emulator.init(document.getElementById('emulator_screen_canvas'), rom);
  emulator.setPC(start_address);
  updateCpuState(jump_to_pc);
  updateBreakpoints();
}

function stepEmulator(step_type) {
  if (!emulator.isAvailable()) {
    initEmulator(step_type == 'single' || step_type == 'frame');
    return false;
  }
  var result = emulator.step(step_type);
  updateCpuState(step_type == 'single' || step_type == 'frame');
  return result;
}

export function updateBreakpoints() {
  emulator.clearBreakpoints();
  var breakpoints = textEditor.getBreakpoints();
  for (var data of breakpoints) {
    var [filename, line_nr, valid] = data;
    data[2] = false;
    if (typeof line_to_addr[filename] == 'undefined' || typeof line_to_addr[filename][line_nr] == 'undefined') continue;
    data[2] = true;
    for (var addr of line_to_addr[filename][line_nr]) emulator.setBreakpoint(addr);
  }
}

function handleGBKey(code, down) {
  //Map the directional keys and A/S to B/A and shift/enter to select/start
  if (code == 'ArrowRight') emulator.setKeyPad('right', down);
  if (code == 'ArrowLeft') emulator.setKeyPad('left', down);
  if (code == 'ArrowUp') emulator.setKeyPad('up', down);
  if (code == 'ArrowDown') emulator.setKeyPad('down', down);
  if (code == 'KeyS') emulator.setKeyPad('a', down);
  if (code == 'KeyA') emulator.setKeyPad('b', down);
  if (code == 'ShiftRight') emulator.setKeyPad('select', down);
  if (code == 'Enter') emulator.setKeyPad('start', down);
  if (code == 'Escape') {
    document.getElementById('cpu_run_check').checked = false;
    document.getElementById('cpu_run_check').onclick();
  }
}

function toHex(num, digits) {
  return '$' + ('0000' + num.toString(16)).slice(-digits);
}

function updateCpuState(afterSingleStep) {
  emulator.renderScreen();

  var pc = emulator.getPC();
  document.getElementById('cpu_pc').innerHTML = toHex(pc, 4);
  document.getElementById('cpu_sp').innerHTML = toHex(emulator.getSP(), 4);
  document.getElementById('cpu_a').innerHTML = toHex(emulator.getA(), 2);
  document.getElementById('cpu_bc').innerHTML = toHex(emulator.getBC(), 4);
  document.getElementById('cpu_de').innerHTML = toHex(emulator.getDE(), 4);
  document.getElementById('cpu_hl').innerHTML = toHex(emulator.getHL(), 4);
  document.getElementById('cpu_flags').innerHTML = emulator.getFlags();

  var file_line_nr = addr_to_line[pc];
  if (typeof file_line_nr == 'undefined') file_line_nr = addr_to_line[pc - 1];
  if (typeof file_line_nr != 'undefined') textEditor.setCpuLine(file_line_nr[0], file_line_nr[1], afterSingleStep);
  else textEditor.setCpuLine(null, null);
  updateVRamCanvas();
  updateTextView();
}

function updateVRamCanvas() {
  var canvas = document.getElementById('emulator_vram_canvas');
  if (canvas.style.display != '') return;

  if (emu_view == 'vram') emulator.renderVRam(canvas);
  if (emu_view == 'bg0') emulator.renderBackground(canvas, 0);
  if (emu_view == 'bg1') emulator.renderBackground(canvas, 1);
}

function updateTextView() {
  var display_text = document.getElementById('emulator_display_text');
  if (display_text.style.display != '') return;
  var data = rom;
  var bank_size = 0x4000;
  var offset = 0x0000;
  var symbols = compiler.getRomSymbols();
  if (emu_view == 'wram') {
    data = emulator.getWRam();
    bank_size = 0x1000;
    offset = 0xc000;
    symbols = compiler.getRamSymbols();
  }
  if (emu_view == 'hram') {
    data = emulator.getHRam();
    bank_size = 0x1000;
    offset = 0xff80;
    symbols = compiler.getRamSymbols();
  }
  if (emu_view == 'io') {
    var text = '';
    var registers = [
      { name: 'P1', value: 0xff00 },
      { name: 'SB', value: 0xff01 },
      { name: 'SC', value: 0xff02 },
      { name: 'DIV', value: 0xff04 },
      { name: 'TIMA', value: 0xff05 },
      { name: 'TMA', value: 0xff06 },
      { name: 'TAC', value: 0xff07 },
      { name: 'IF', value: 0xff0f },
      { name: 'LCDC', value: 0xff40 },
      { name: 'STAT', value: 0xff41 },
      { name: 'SCY', value: 0xff42 },
      { name: 'SCX', value: 0xff43 },
      { name: 'LY', value: 0xff44 },
      { name: 'LYC', value: 0xff45 },
      { name: 'DMA', value: 0xff46 },
      { name: 'BGP', value: 0xff47 },
      { name: 'OBP0', value: 0xff48 },
      { name: 'OBP1', value: 0xff49 },
      { name: 'WY', value: 0xff4a },
      { name: 'WX', value: 0xff4b },
      { name: 'KEY1', value: 0xff4d },
      { name: 'VBK', value: 0xff4f },
      { name: 'RP', value: 0xff56 },
      { name: 'BCPS', value: 0xff68 },
      { name: 'BCPD', value: 0xff69 },
      { name: 'OCPS', value: 0xff6a },
      { name: 'OCPD', value: 0xff6b },
      { name: 'SVBK', value: 0xff70 },
      { name: 'IE', value: 0xffff },
    ];
    for (var reg_info of registers) {
      text +=
        "<span style='float: left; width: 50px'>" +
        reg_info.name +
        ':</span>' +
        ('00' + emulator.readMem(reg_info.value).toString(16)).slice(-2) +
        '<br/>';
    }
    display_text.innerHTML = text;
    return;
  }
  if (emu_view == 'serial') {
    var text = '';
    for (var n = 0; n < serial_log_buffer.length; n += 16) {
      text += serial_log_buffer.slice(n, n + 16).join(' ') + '\n';
    }
    display_text.textContent = text;
    return;
  }
  if (typeof data == 'undefined') return;

  var text =
    "<div class='emulator_display_header'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0&nbsp; 1&nbsp; 2&nbsp; 3&nbsp; 4&nbsp; 5&nbsp; 6&nbsp; 7&nbsp; 8&nbsp; 9&nbsp; a&nbsp; b&nbsp; c&nbsp; d&nbsp; e&nbsp; f</div>";
  var symbol = null;
  var span = false;
  var span_color = 0;
  for (var n = 0; n < data.length; n += 16) {
    var hex = Array.prototype.map.call(data.slice(n, n + 16), (x) => ('00' + x.toString(16)).slice(-2));
    var bank = ~~(n / bank_size);
    var addr = n & (bank_size - 1);
    if (bank > 0) addr += bank_size;
    text += ('00' + bank.toString(16)).slice(-2) + ':' + ('0000' + (addr + offset).toString(16)).slice(-4);
    for (var idx = 0; idx < hex.length; idx++) {
      text += ' ';
      var new_symbol = symbols[n + idx + offset];
      if (new_symbol) {
        symbol = new_symbol;
        if (span) text += '</span>';
        span = false;
        span_color = (span_color + 71) % 360;
      } else if (new_symbol === null) {
        symbol = null;
        if (span) text += '</span>';
        span = false;
      }
      if (symbol && !span) {
        text +=
          "<span title='" +
          symbol +
          "' style='background-color: hsl(" +
          span_color +
          (isDarkMode() ? ", 30%, 30%)'>" : ", 50%, 50%)'>");
        span = true;
      }
      text += hex[idx];
    }
    if (span) text += '</span>';
    span = false;
    text += '<br/>';
  }
  display_text.innerHTML = text;
}

export function updateFileList() {
  var filelist = document.getElementById('filelist');
  filelist.textContent = '';

  for (const name of Object.keys(storage.getFiles()).sort()) {
    var entry = document.createElement('li');
    entry.textContent = name;
    filelist.appendChild(entry);

    if (name == editors.getCurrentFilename()) entry.classList.add('active');
    for (var [type, filename, line_nr, message] of compiler.getErrors()) {
      if (filename != name) continue;
      entry.classList.add(type);
      if (type == 'error') {
        entry.classList.remove('warning');
        break;
      }
    }
  }
}

function deleteFile(name) {
  if (Object.keys(storage.getFiles()).length < 2) return;
  storage.update(name, null);
  if (editors.getCurrentFilename() == name) editors.setCurrentFile(Object.keys(storage.getFiles()).sort()[0]);
  updateFileList();
}

function showTabType(type) {
  const tabTypes = ['emulator_screen_canvas', 'emulator_vram_canvas', 'emulator_display_text'];
  tabTypes.forEach((tabType) => {
    document.getElementById(tabType).style.display = type == tabType ? '' : 'none';
  });
}

export function init(event) {
  textEditor.register('textEditorDiv', compileCode);
  gfxEditor.register('gfxEditorDiv');

  var urlParams = new URLSearchParams(window.location.search);
  const asmOptions = (urlParams.get('asm') ?? '').trim();
  if (asmOptions != '') {
    document.getElementById('compiler_settings_asm').value = asmOptions;
    compiler.setAsmOptions(asmOptions.split(' '));
  }
  const linkOptions = (urlParams.get('link') ?? '').trim();
  if (linkOptions != '') {
    document.getElementById('compiler_settings_link').value = linkOptions;
    compiler.setLinkOptions(linkOptions.split(' '));
  }
  const fixOptions = (urlParams.get('fix') ?? '').trim();
  if (fixOptions != '') {
    document.getElementById('compiler_settings_fix').value = fixOptions;
    compiler.setFixOptions(fixOptions.split(' '));
  }

  storage.autoLoad();
  editors.setCurrentFile(Object.keys(storage.getFiles()).pop());
  updateFileList();

  document.getElementById('filelist').onclick = function (e) {
    if (!e.target.childNodes[0].wholeText) return;
    editors.setCurrentFile(e.target.childNodes[0].wholeText);

    updateFileList();
    updateCpuState();
  };
  document.getElementById('newfile').onclick = function () {
    document.getElementById('newfiledialog').style.display = 'block';
  };
  document.getElementById('newfiledialog').onclick = function (e) {
    if (e.target == document.getElementById('newfiledialog'))
      document.getElementById('newfiledialog').style.display = 'none';
  };
  document.getElementById('newfiledialogclose').onclick = function () {
    document.getElementById('newfiledialog').style.display = 'none';
  };
  document.getElementById('newfile_empty_create').onclick = function () {
    var result = document.getElementById('newfile_name').value;
    if (!result) return;
    if (result.indexOf('.') < 0) result += '.asm';
    if (result in storage.getFiles()) return;
    if (editors.getFileType(result) === 'text') storage.update(result, '');
    else storage.update(result, new Uint8Array(16));
    editors.setCurrentFile(result);
    updateFileList();
    document.getElementById('newfiledialog').style.display = 'none';
  };
  document.getElementById('newfile_upload').onchange = function (e) {
    if (e.target.files.length > 0) {
      var name = e.target.files[0].name;
      var p = editors.getFileType(name) == 'text' ? e.target.files[0].text() : e.target.files[0].arrayBuffer();
      p.then(function (data) {
        storage.update(name, data);
        editors.setCurrentFile(name);
        updateFileList();
      });
      e.target.value = '';
      document.getElementById('newfiledialog').style.display = 'none';
    }
  };

  document.getElementById('delfile').onclick = function () {
    if (confirm('Are you sure you want to delete: ' + editors.getCurrentFilename() + '?'))
      deleteFile(editors.getCurrentFilename());
  };
  document.getElementById('newproject').onclick = function () {
    if (!confirm('Are you sure to clear the current project?')) return;
    storage.reset();
    editors.setCurrentFile('main.asm');
    updateFileList();
  };

  compileCode();

  document.getElementById('cpu_single_step').onclick = function () {
    stepEmulator('single');
  };
  document.getElementById('cpu_frame_step').onclick = function () {
    stepEmulator('frame');
  };
  document.getElementById('cpu_reset').onclick = function () {
    initEmulator(true);
  };
  document.getElementById('cpu_run_check').onclick = function () {
    if (document.getElementById('cpu_run_check').checked) {
      function runFunction() {
        if (!document.hidden) {
          if (stepEmulator('run')) document.getElementById('cpu_run_check').checked = false;
        }
        if (document.getElementById('cpu_run_check').checked) requestAnimationFrame(runFunction);
      }
      requestAnimationFrame(runFunction);
    }
  };
  var canvas = document.getElementById('emulator_screen_canvas');
  canvas.tabIndex = -1;
  canvas.onkeydown = function (e) {
    handleGBKey(e.code, true);
    e.preventDefault();
  };
  canvas.onkeyup = function (e) {
    handleGBKey(e.code, false);
    e.preventDefault();
  };
  document.onkeydown = function (e) {
    if (e.code == 'F8') {
      stepEmulator('single');
      e.preventDefault();
    }
    if (e.code == 'F9') {
      stepEmulator('frame');
      e.preventDefault();
    }
  };

  document.getElementById('emulator_display_screen').onclick = function () {
    showTabType('emulator_screen_canvas');
    emu_view = 'display';
  };
  document.getElementById('emulator_display_vram').onclick = function () {
    showTabType('emulator_vram_canvas');
    emu_view = 'vram';
    updateVRamCanvas();
  };
  document.getElementById('emulator_display_bg0').onclick = function () {
    showTabType('emulator_vram_canvas');
    emu_view = 'bg0';
    updateVRamCanvas();
  };
  document.getElementById('emulator_display_bg1').onclick = function () {
    showTabType('emulator_vram_canvas');
    emu_view = 'bg1';
    updateVRamCanvas();
  };
  document.getElementById('emulator_display_rom').onclick = function () {
    showTabType('emulator_display_text');
    emu_view = 'rom';
    updateTextView();
  };
  document.getElementById('emulator_display_wram').onclick = function () {
    showTabType('emulator_display_text');
    emu_view = 'wram';
    updateTextView();
  };
  document.getElementById('emulator_display_hram').onclick = function () {
    showTabType('emulator_display_text');
    emu_view = 'hram';
    updateTextView();
  };
  document.getElementById('emulator_display_io').onclick = function () {
    showTabType('emulator_display_text');
    emu_view = 'io';
    updateTextView();
  };
  document.getElementById('emulator_display_serial').onclick = function () {
    showTabType('emulator_display_text');
    emu_view = 'serial';
    updateTextView();
  };

  document.getElementById('download_rom').onclick = function () {
    if (typeof rom == 'undefined') return;
    var element = document.createElement('a');
    var url = window.URL.createObjectURL(new Blob([rom.buffer], { type: 'application/octet-stream' }));
    element.setAttribute('href', url);
    element.setAttribute('download', 'rom.gb');

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    window.URL.revokeObjectURL(url);
  };

  document.getElementById('importmenu').onclick = function () {
    document.getElementById('importdialog').style.display = 'block';
  };
  document.getElementById('importdialog').onclick = function (e) {
    if (e.target == document.getElementById('importdialog'))
      document.getElementById('importdialog').style.display = 'none';
  };
  document.getElementById('importdialogclose').onclick = function () {
    document.getElementById('importdialog').style.display = 'none';
  };
  document.getElementById('import_gist').onclick = function () {
    storage.loadGithubGist(document.getElementById('import_gist_url').value);
    document.getElementById('importdialog').style.display = 'none';
  };
  document.getElementById('import_zipfile').onchange = function (e) {
    if (e.target.files.length > 0) {
      storage.loadZip(e.target.files[0]);
      e.target.value = '';
      document.getElementById('importdialog').style.display = 'none';
    }
  };
  document.getElementById('exportmenu').onclick = function () {
    //storage.save();
    document.getElementById('exportdialog').style.display = 'block';

    document.getElementById('export_hash_url').value = storage.getHashUrl();
  };
  document.getElementById('exportdialog').onclick = function (e) {
    if (e.target == document.getElementById('exportdialog'))
      document.getElementById('exportdialog').style.display = 'none';
  };
  document.getElementById('exportdialogclose').onclick = function () {
    document.getElementById('exportdialog').style.display = 'none';
  };
  document.getElementById('export_gist').onclick = function () {
    var url = document.getElementById('export_gist_url').value;
    var username = document.getElementById('export_gist_username').value;
    var token = document.getElementById('export_gist_token').value;

    url = storage.saveGithubGist(username, token, url);
    if (url == null) {
      document.getElementById('export_gist_import_url').value = 'Gist create/update failed. Incorrect token?';
    } else {
      document.getElementById('export_gist_url').value = url;

      var auto_import_url = new URL(document.location);
      auto_import_url.hash = url;
      document.getElementById('export_gist_import_url').value = auto_import_url.toString();
    }
  };
  document.getElementById('export_zip').onclick = function () {
    storage.downloadZip();
  };

  document.getElementById('infomenu').onclick = function () {
    document.getElementById('infodialog').style.display = 'block';
  };
  document.getElementById('infodialog').onclick = function (e) {
    if (e.target == document.getElementById('infodialog')) document.getElementById('infodialog').style.display = 'none';
  };
  document.getElementById('infodialogclose').onclick = function () {
    document.getElementById('infodialog').style.display = 'none';
  };

  document.getElementById('auto_url_update').checked = storage.config.autoUrl;
  document.getElementById('auto_url_update').onclick = function () {
    storage.config.autoUrl = document.getElementById('auto_url_update').checked;
    if (storage.config.autoUrl) storage.update();
    else document.location.hash = '';
  };
  document.getElementById('auto_local_storage_update').checked = storage.config.autoLocalStorage;
  document.getElementById('auto_local_storage_update').onclick = function () {
    storage.config.autoLocalStorage = document.getElementById('auto_local_storage_update').checked;
    storage.update();
  };

  document.getElementById('settingsmenu').onclick = function () {
    document.getElementById('settingsdialog').style.display = 'block';
  };
  document.getElementById('settingsdialog').onclick = function (e) {
    if (e.target == document.getElementById('settingsdialog'))
      document.getElementById('settingsdialog').style.display = 'none';
  };
  document.getElementById('settingsdialogclose').onclick = function () {
    document.getElementById('settingsdialog').style.display = 'none';
  };
  document.getElementById('compiler_settings_set').onclick = function () {
    urlParams = new URLSearchParams(window.location.search);
    var asmOptions = document.getElementById('compiler_settings_asm').value.trim();
    if (asmOptions != '') {
      urlParams.set('asm', asmOptions);
      compiler.setAsmOptions(asmOptions.split(' '));
    } else {
      compiler.setAsmOptions([]);
      urlParams.delete('asm');
    }
    var linkOptions = document.getElementById('compiler_settings_link').value.trim();
    if (linkOptions != '') {
      urlParams.set('link', linkOptions);
      compiler.setLinkOptions(linkOptions.split(' '));
    } else {
      compiler.setLinkOptions([]);
      urlParams.delete('link');
    }
    var fixOptions = document.getElementById('compiler_settings_fix').value.trim();
    if (fixOptions != '') {
      urlParams.set('fix', fixOptions);
      compiler.setFixOptions(fixOptions.split(' '));
    } else {
      urlParams.delete('fix');
      compiler.setFixOptions([]);
    }
    var url = new URL(window.location);
    url.search = urlParams.toString();
    window.history.replaceState({}, '', url);
    document.getElementById('settingsdialog').style.display = 'none';
    compileCode();
  };
  if (urlParams.has('autorun')) {
    document.getElementById('cpu_run_check').checked = true;
    document.getElementById('cpu_run_check').onclick();
  }
}
