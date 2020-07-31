"use strict";

(function(global) {
    var e;
    var rom_ptr;
    var rom_size = 0;
    var canvas_ctx;
    var canvas_image_data;
    var audio_ctx;
    var audio_time;
    
    global.emulatorInit = function(canvas, rom_data, start_address) {
        if (emulatorIsAvailable()) emulatorDestroy();

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
        for(var n=0; n<rom.length; n++)
            Module.HEAP8[rom_ptr + n] = rom_data[n];
        
        e = Module._emulator_new_simple(rom_ptr, rom_size, audio_ctx.sampleRate, 4096);
        Module._emulator_set_bw_palette_simple(e, 0, 0xFFC2F0C4, 0xFFA8B95A, 0xFF6E601E, 0xFF001B2D);
        Module._emulator_set_bw_palette_simple(e, 1, 0xFFC2F0C4, 0xFFA8B95A, 0xFF6E601E, 0xFF001B2D);
        Module._emulator_set_bw_palette_simple(e, 2, 0xFFC2F0C4, 0xFFA8B95A, 0xFF6E601E, 0xFF001B2D);
        Module._emulator_set_PC(e, start_address);
        Module._emulator_set_default_joypad_callback(e, 0);
        
        canvas_ctx = canvas.getContext("2d");
        canvas_image_data = canvas_ctx.createImageData(canvas.width, canvas.height);
        
        audio_ctx.resume()
        audio_time = audio_ctx.currentTime;
    }
    
    global.emulatorDestroy = function() {
        if (!emulatorIsAvailable()) return;
        Module._emulator_delete(e);
        e = undefined;
    }
    
    global.emulatorIsAvailable = function() {
        return (typeof(e) != "undefined");
    }
    
    global.emulatorStep = function(step_type) {
        if (!emulatorIsAvailable()) return;
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
                console.log(audio_time - audio_ctx.currentTime);
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
    
    global.emulatorRenderScreen = function() {
        if (!emulatorIsAvailable()) return;
        var buffer = new Uint8Array(Module.HEAP8.buffer, Module._get_frame_buffer_ptr(e), Module._get_frame_buffer_size(e));
        canvas_image_data.data.set(buffer);
        canvas_ctx.putImageData(canvas_image_data, 0, 0);
    }
    
    global.emulatorRenderVRam = function(canvas) {
        if (!emulatorIsAvailable()) return;
        var ctx = canvas.getContext("2d");
        var image_data = canvas_ctx.createImageData(256, 256);
        var ptr = Module._malloc(4 * 256 * 256);
        Module._emulator_render_vram(e, ptr);
        var buffer = new Uint8Array(Module.HEAP8.buffer, ptr, 4 * 256 * 256);
        image_data.data.set(buffer);
        ctx.putImageData(image_data, 0, 0);
        Module._free(ptr);
    }

    global.emulatorRenderBackground = function(canvas, type) {
        if (!emulatorIsAvailable()) return;
        var ctx = canvas.getContext("2d");
        var image_data = canvas_ctx.createImageData(256, 256);
        var ptr = Module._malloc(4 * 256 * 256);
        Module._emulator_render_background(e, ptr, type);
        var buffer = new Uint8Array(Module.HEAP8.buffer, ptr, 4 * 256 * 256);
        image_data.data.set(buffer);
        ctx.putImageData(image_data, 0, 0);
        Module._free(ptr);
    }
    
    global.emulatorGetPC = function() {
        return Module._emulator_get_PC(e);
    }
    global.emulatorGetSP = function() {
        return Module._emulator_get_SP(e);
    }
    global.emulatorGetA = function() {
        return Module._emulator_get_A(e);
    }
    global.emulatorGetBC = function() {
        return Module._emulator_get_BC(e);
    }
    global.emulatorGetDE = function() {
        return Module._emulator_get_DE(e);
    }
    global.emulatorGetHL = function() {
        return Module._emulator_get_HL(e);
    }
    global.emulatorGetFlags = function() {
        var flags = Module._emulator_get_F(e);
        var result = "";
        if (flags & 0x80) result += "Z ";
        if (flags & 0x10) result += "C ";
        if (flags & 0x20) result += "H ";
        if (flags & 0x40) result += "N ";
        return result;
    }

    global.emulatorSetBreakpoint = function(pc) {
        if (!emulatorIsAvailable()) return;
        Module._emulator_set_breakpoint(e, pc);
    }
    global.emulatorClearBreakpoints = function() {
        if (!emulatorIsAvailable()) return;
        Module._emulator_clear_breakpoints(e);
    }
    
    global.emulatorSetKeyPad = function(key, down) {
        if (!emulatorIsAvailable()) return;
        if (key == "right") Module._set_joyp_right(e, down);
        if (key == "left") Module._set_joyp_left(e, down);
        if (key == "up") Module._set_joyp_up(e, down);
        if (key == "down") Module._set_joyp_down(e, down);
        if (key == "a") Module._set_joyp_A(e, down);
        if (key == "b") Module._set_joyp_B(e, down);
        if (key == "select") Module._set_joyp_select(e, down);
        if (key == "start") Module._set_joyp_start(e, down);
    }
    
    function processAudioBuffer()
    {
        if (audio_time < audio_ctx.currentTime)
            audio_time = audio_ctx.currentTime;

        var input_buffer = new Uint8Array(Module.HEAP8.buffer, Module._get_audio_buffer_ptr(e), Module._get_audio_buffer_capacity(e));
        const volume = 0.5;
        const buffer = audio_ctx.createBuffer(2, 4096, audio_ctx.sampleRate);
        const channel0 = buffer.getChannelData(0);
        const channel1 = buffer.getChannelData(1);
        
        for (let i = 0; i < 4096; i++) {
            channel0[i] = input_buffer[2 * i] * volume / 255;
            channel1[i] = input_buffer[2 * i + 1] * volume / 255;
        }
        const bufferSource = audio_ctx.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(audio_ctx.destination);
        bufferSource.start(audio_time);
        const buffer_sec = 4096 / audio_ctx.sampleRate;
        audio_time += buffer_sec;
    }
})(this);
