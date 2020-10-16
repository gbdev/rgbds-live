"use strict";

this.emulator = new Object();
(function(emulator) {
    var e;
    var rom_ptr;
    var rom_size = 0;
    var canvas_ctx;
    var canvas_image_data;
    var audio_ctx;
    var audio_time;
    var serial_callback = null;
    var audio_buffer_size = 2048;
    
    emulator.init = function(canvas, rom_data) {
        if (emulator.isAvailable()) emulator.destroy();

        if (typeof(audio_ctx) == "undefined")
            audio_ctx = new AudioContext();

        var required_size = ((rom_data.length - 1) | 0x3FFF) + 1;
        if (required_size < 0x8000) required_size = 0x8000;
        if (rom_size < required_size)
        {
            if (typeof(rom_ptr) != "undefined") Module._free(rom_ptr);
            rom_ptr = Module._malloc(required_size);
            rom_size = required_size;
        }
        for(var n=0; n<rom_size; n++)
            Module.HEAP8[rom_ptr + n] = 0
        for(var n=0; n<rom_data.length; n++)
            Module.HEAP8[rom_ptr + n] = rom_data[n];
        
        e = Module._emulator_new_simple(rom_ptr, rom_size, audio_ctx.sampleRate, audio_buffer_size);
        Module._emulator_set_bw_palette_simple(e, 0, 0xFFC2F0C4, 0xFFA8B95A, 0xFF6E601E, 0xFF001B2D);
        Module._emulator_set_bw_palette_simple(e, 1, 0xFFC2F0C4, 0xFFA8B95A, 0xFF6E601E, 0xFF001B2D);
        Module._emulator_set_bw_palette_simple(e, 2, 0xFFC2F0C4, 0xFFA8B95A, 0xFF6E601E, 0xFF001B2D);
        Module._emulator_set_default_joypad_callback(e, 0);
        
        if (canvas)
        {
            canvas_ctx = canvas.getContext("2d");
            canvas_image_data = canvas_ctx.createImageData(canvas.width, canvas.height);
        }
        
        audio_ctx.resume()
        audio_time = audio_ctx.currentTime;
    }
    
    emulator.updateRom = function(rom_data)
    {
        if (!emulator.isAvailable()) return false;

        var required_size = ((rom_data.length - 1) | 0x3FFF) + 1;
        if (required_size < 0x8000) required_size = 0x8000;
        if (rom_size < required_size)
            return false;
        for(var n=0; n<rom_size; n++)
            Module.HEAP8[rom_ptr + n] = 0
        for(var n=0; n<rom_data.length; n++)
            Module.HEAP8[rom_ptr + n] = rom_data[n];
        return true;
    }
    
    emulator.destroy = function() {
        if (!emulator.isAvailable()) return;
        Module._emulator_delete(e);
        e = undefined;
    }
    
    emulator.isAvailable = function() {
        return (typeof(e) != "undefined");
    }
    
    emulator.step = function(step_type) {
        if (!emulator.isAvailable()) return;
        var ticks = Module._emulator_get_ticks_f64(e);
        if (step_type == "single")
            ticks += 1;
        else if (step_type == "frame")
            ticks += 70224;
        while(true) {
            var result = Module._emulator_run_until_f64(e, ticks);
            if (result & 2)
                processAudioBuffer()
            if (result & 8) // Breakpoint hit
                return true;
            if (result & 16) // Illegal instruction
                return true;
            if ((result != 2) && (step_type != "run"))
                return false;
            if (step_type == "run")
            {
                if (result & 4)
                {
                    // Sync to the audio buffer, make sure we have 100ms of audio data buffered.
                    if (audio_time < audio_ctx.currentTime + 0.1)
                        ticks += 70224;
                    else
                        return false;
                }
            }
        }
    }

    emulator.renderScreen = function() {
        if (!emulator.isAvailable()) return;
        var buffer = new Uint8Array(Module.HEAP8.buffer, Module._get_frame_buffer_ptr(e), Module._get_frame_buffer_size(e));
        canvas_image_data.data.set(buffer);
        canvas_ctx.putImageData(canvas_image_data, 0, 0);
    }
    
    emulator.renderVRam = function(canvas) {
        if (!emulator.isAvailable()) return;
        var ctx = canvas.getContext("2d");
        var image_data = canvas_ctx.createImageData(256, 256);
        var ptr = Module._malloc(4 * 256 * 256);
        Module._emulator_render_vram(e, ptr);
        var buffer = new Uint8Array(Module.HEAP8.buffer, ptr, 4 * 256 * 256);
        image_data.data.set(buffer);
        ctx.putImageData(image_data, 0, 0);
        Module._free(ptr);
    }

    emulator.renderBackground = function(canvas, type) {
        if (!emulator.isAvailable()) return;
        var ctx = canvas.getContext("2d");
        var image_data = canvas_ctx.createImageData(256, 256);
        var ptr = Module._malloc(4 * 256 * 256);
        Module._emulator_render_background(e, ptr, type);
        var buffer = new Uint8Array(Module.HEAP8.buffer, ptr, 4 * 256 * 256);
        image_data.data.set(buffer);
        ctx.putImageData(image_data, 0, 0);
        Module._free(ptr);
    }
    
    emulator.getWRam = function() {
        if (!emulator.isAvailable()) return;
        
        var ptr = Module._emulator_get_wram_ptr(e);
        return new Uint8Array(Module.HEAP8.buffer, ptr, 0x8000);
    }

    emulator.getHRam = function() {
        if (!emulator.isAvailable()) return;
        
        var ptr = Module._emulator_get_hram_ptr(e);
        return new Uint8Array(Module.HEAP8.buffer, ptr, 0x7F);
    }
    
    emulator.getPC = function() {
        return Module._emulator_get_PC(e);
    }
    emulator.setPC = function(pc) {
        Module._emulator_set_PC(e, pc);
    }
    emulator.getSP = function() {
        return Module._emulator_get_SP(e);
    }
    emulator.getA = function() {
        return Module._emulator_get_A(e);
    }
    emulator.getBC = function() {
        return Module._emulator_get_BC(e);
    }
    emulator.getDE = function() {
        return Module._emulator_get_DE(e);
    }
    emulator.getHL = function() {
        return Module._emulator_get_HL(e);
    }
    emulator.getFlags = function() {
        var flags = Module._emulator_get_F(e);
        var result = "";
        if (flags & 0x80) result += "Z ";
        if (flags & 0x10) result += "C ";
        if (flags & 0x20) result += "H ";
        if (flags & 0x40) result += "N ";
        return result;
    }
    emulator.readMem = function(addr) {
        if (!emulator.isAvailable()) return 0xFF;
        return Module._emulator_read_mem(e, addr);
    }
    emulator.writeMem = function(addr, data) {
        if (!emulator.isAvailable()) return;
        return Module._emulator_write_mem(e, addr, data);
    }

    emulator.setBreakpoint = function(pc) {
        if (!emulator.isAvailable()) return;
        Module._emulator_set_breakpoint(e, pc);
    }
    emulator.clearBreakpoints = function() {
        if (!emulator.isAvailable()) return;
        Module._emulator_clear_breakpoints(e);
    }
    
    emulator.setKeyPad = function(key, down) {
        if (!emulator.isAvailable()) return;
        if (key == "right") Module._set_joyp_right(e, down);
        if (key == "left") Module._set_joyp_left(e, down);
        if (key == "up") Module._set_joyp_up(e, down);
        if (key == "down") Module._set_joyp_down(e, down);
        if (key == "a") Module._set_joyp_A(e, down);
        if (key == "b") Module._set_joyp_B(e, down);
        if (key == "select") Module._set_joyp_select(e, down);
        if (key == "start") Module._set_joyp_start(e, down);
    }
    
    emulator.setSerialCallback = function(callback) {
        serial_callback = callback;
    }
    
    emulator.serialCallback = function(value) {
        if (serial_callback)
            serial_callback(value);
    }
    
    function processAudioBuffer()
    {
        if (audio_time < audio_ctx.currentTime)
            audio_time = audio_ctx.currentTime;

        var input_buffer = new Uint8Array(Module.HEAP8.buffer, Module._get_audio_buffer_ptr(e), Module._get_audio_buffer_capacity(e));
        const volume = 0.5;
        const buffer = audio_ctx.createBuffer(2, audio_buffer_size, audio_ctx.sampleRate);
        const channel0 = buffer.getChannelData(0);
        const channel1 = buffer.getChannelData(1);
        
        for (let i = 0; i < audio_buffer_size; i++) {
            channel0[i] = input_buffer[2 * i] * volume / 255;
            channel1[i] = input_buffer[2 * i + 1] * volume / 255;
        }
        const bufferSource = audio_ctx.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(audio_ctx.destination);
        bufferSource.start(audio_time);
        const buffer_sec = audio_buffer_size / audio_ctx.sampleRate;
        audio_time += buffer_sec;
    }
})(this.emulator);
