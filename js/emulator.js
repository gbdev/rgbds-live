import Binjgb from '../binjgb/out/binjgb.js';

const Module = await Binjgb();

var e;
var rom_size = 0;
var canvas_ctx;
var canvas_image_data;
var audio_ctx;
var audio_time;
var serial_callback = null;
var audio_buffer_size = 2048;

export function init(canvas, rom_data) {
  if (isAvailable()) destroy();

  if (typeof audio_ctx == 'undefined') audio_ctx = new AudioContext();

  var required_size = ((rom_data.length - 1) | 0x3fff) + 1;
  if (required_size < 0x8000) required_size = 0x8000;
  var rom_ptr = Module._malloc(required_size);
  rom_size = required_size;

  const romView = Module.HEAP8.subarray(rom_ptr, rom_ptr + rom_size);
  romView.fill(0);
  romView.set(rom_data);

  // Note: this takes ownership of `rom_ptr`, even if init fails.
  //       The ROM will be freed when `emulator_delete` is called from `destroy()`, and not leaked.
  e = Module._emulator_new_simple(rom_ptr, rom_size, audio_ctx.sampleRate, audio_buffer_size);
  Module._emulator_set_bw_palette_simple(e, 0, 0xffc2f0c4, 0xffa8b95a, 0xff6e601e, 0xff001b2d);
  Module._emulator_set_bw_palette_simple(e, 1, 0xffc2f0c4, 0xffa8b95a, 0xff6e601e, 0xff001b2d);
  Module._emulator_set_bw_palette_simple(e, 2, 0xffc2f0c4, 0xffa8b95a, 0xff6e601e, 0xff001b2d);
  Module._emulator_set_default_joypad_callback(e, 0);

  if (canvas) {
    canvas_ctx = canvas.getContext('2d');
    canvas_image_data = canvas_ctx.createImageData(canvas.width, canvas.height);
  }

  audio_ctx.resume();
  audio_time = audio_ctx.currentTime;
}

export function destroy() {
  if (!isAvailable()) return;
  Module._emulator_delete(e);
  e = undefined;
}

export function isAvailable() {
  return typeof e != 'undefined';
}

export function step(step_type) {
  if (!isAvailable()) return;
  var ticks = Module._emulator_get_ticks_f64(e);
  if (step_type == 'single') ticks += 1;
  else if (step_type == 'frame') ticks += 70224;
  while (true) {
    var result = Module._emulator_run_until_f64(e, ticks);
    if (result & 2) processAudioBuffer();
    if (result & 8)
      // Breakpoint hit
      return true;
    if (result & 16)
      // Illegal instruction
      return true;
    if (result != 2 && step_type != 'run') return false;
    if (step_type == 'run') {
      if (result & 4) {
        // Sync to the audio buffer, make sure we have 100ms of audio data buffered.
        if (audio_time < audio_ctx.currentTime + 0.1) ticks += 70224;
        else return false;
      }
    }
  }
}

export function renderScreen() {
  if (!isAvailable()) return;
  var buffer = new Uint8Array(
    Module.HEAP8.buffer,
    Module._get_frame_buffer_ptr(e),
    Module._get_frame_buffer_size(e)
  );
  canvas_image_data.data.set(buffer);
  canvas_ctx.putImageData(canvas_image_data, 0, 0);
}

export function renderVRam(canvas) {
  if (!isAvailable()) return;
  var ctx = canvas.getContext('2d');
  var image_data = canvas_ctx.createImageData(256, 256);
  var ptr = Module._malloc(4 * 256 * 256);
  Module._emulator_render_vram(e, ptr);
  var buffer = new Uint8Array(Module.HEAP8.buffer, ptr, 4 * 256 * 256);
  image_data.data.set(buffer);
  ctx.putImageData(image_data, 0, 0);
  Module._free(ptr);
}

export function renderBackground(canvas, type) {
  if (!isAvailable()) return;
  var ctx = canvas.getContext('2d');
  var image_data = canvas_ctx.createImageData(256, 256);
  var ptr = Module._malloc(4 * 256 * 256);
  Module._emulator_render_background(e, ptr, type);
  var buffer = new Uint8Array(Module.HEAP8.buffer, ptr, 4 * 256 * 256);
  image_data.data.set(buffer);
  ctx.putImageData(image_data, 0, 0);
  Module._free(ptr);
}

export function getWRam() {
  if (!isAvailable()) return;

  var ptr = Module._emulator_get_wram_ptr(e);
  return new Uint8Array(Module.HEAP8.buffer, ptr, 0x8000);
}

export function getHRam() {
  if (!isAvailable()) return;

  var ptr = Module._emulator_get_hram_ptr(e);
  return new Uint8Array(Module.HEAP8.buffer, ptr, 0x7f);
}

export function getPC() {
  return Module._emulator_get_PC(e);
}
export function setPC(pc) {
  Module._emulator_set_PC(e, pc);
}
export function getSP() {
  return Module._emulator_get_SP(e);
}
export function getA() {
  return Module._emulator_get_A(e);
}
export function getBC() {
  return Module._emulator_get_BC(e);
}
export function getDE() {
  return Module._emulator_get_DE(e);
}
export function getHL() {
  return Module._emulator_get_HL(e);
}
export function getFlags() {
  var flags = Module._emulator_get_F(e);
  var result = '';
  if (flags & 0x80) result += 'Z ';
  if (flags & 0x10) result += 'C ';
  if (flags & 0x20) result += 'H ';
  if (flags & 0x40) result += 'N ';
  return result;
}
export function readMem(addr) {
  if (!isAvailable()) return 0xff;
  return Module._emulator_read_mem(e, addr);
}
export function writeMem(addr, data) {
  if (!isAvailable()) return;
  return Module._emulator_write_mem(e, addr, data);
}

export function setBreakpoint(pc) {
  if (!isAvailable()) return;
  Module._emulator_set_breakpoint(e, pc);
}
export function clearBreakpoints() {
  if (!isAvailable()) return;
  Module._emulator_clear_breakpoints(e);
}

export function setKeyPad(key, down) {
  if (!isAvailable()) return;
  if (key == 'right') Module._set_joyp_right(e, down);
  if (key == 'left') Module._set_joyp_left(e, down);
  if (key == 'up') Module._set_joyp_up(e, down);
  if (key == 'down') Module._set_joyp_down(e, down);
  if (key == 'a') Module._set_joyp_A(e, down);
  if (key == 'b') Module._set_joyp_B(e, down);
  if (key == 'select') Module._set_joyp_select(e, down);
  if (key == 'start') Module._set_joyp_start(e, down);
}

export function setSerialCallback(callback) {
  serial_callback = callback;
}

export function serialCallback(value) {
  if (serial_callback) serial_callback(value);
}

function processAudioBuffer() {
  if (audio_time < audio_ctx.currentTime) audio_time = audio_ctx.currentTime;

  var input_buffer = new Uint8Array(
    Module.HEAP8.buffer,
    Module._get_audio_buffer_ptr(e),
    Module._get_audio_buffer_capacity(e)
  );
  const volume = 0.5;
  const buffer = audio_ctx.createBuffer(2, audio_buffer_size, audio_ctx.sampleRate);
  const channel0 = buffer.getChannelData(0);
  const channel1 = buffer.getChannelData(1);

  for (let i = 0; i < audio_buffer_size; i++) {
    channel0[i] = (input_buffer[2 * i] * volume) / 255;
    channel1[i] = (input_buffer[2 * i + 1] * volume) / 255;
  }
  const bufferSource = audio_ctx.createBufferSource();
  bufferSource.buffer = buffer;
  bufferSource.connect(audio_ctx.destination);
  bufferSource.start(audio_time);
  const buffer_sec = audio_buffer_size / audio_ctx.sampleRate;
  audio_time += buffer_sec;
}
