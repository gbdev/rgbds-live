"use strict";

function loadUGESong(data)
{
    var song = new Song();

    //TODO: Sanity checks on data.
    //TODO: Use `DataView` object instead of loads of Uint32Arrays
    var offset = 0;
    var version = new Uint32Array(data.slice(offset, offset + 4))[0];
    console.log("uge version: " + version);
    if (version < 0 || version > 3) return null;
    
    var uint8data = new Uint8Array(data);
    offset += 4;
    
    var td = new TextDecoder();
    song.name = td.decode(data.slice(offset + 1, offset + 1 + uint8data[offset]));
    offset += 256;
    song.artist = td.decode(data.slice(offset + 1, offset + 1 + uint8data[offset]));
    offset += 256;
    song.comment = td.decode(data.slice(offset + 1, offset + 1 + uint8data[offset]));
    offset += 256;
    
    var instrument_count = version < 3 ? 15 : 45;
    var duty_instrument_mapping = {}
    var wave_instrument_mapping = {}
    var noise_instrument_mapping = {}
    for(var n=0; n<instrument_count; n++)
    {
        var type = new Uint32Array(data.slice(offset, offset + 4))[0];
        offset += 4;
        var name = td.decode(data.slice(offset + 1, offset + 1 + uint8data[offset]));
        offset += 256;
        
        var length = new Uint32Array(data.slice(offset, offset + 4))[0];
        offset += 4;
        var length_enabled = uint8data[offset];
        offset += 1;
        var initial_volume = uint8data[offset];
        if (initial_volume > 15) initial_volume = 15; //??? bug in the song files?
        offset += 1;
        var volume_direction = uint8data[offset];
        offset += 4;
        var volume_sweep_amount = uint8data[offset];
        offset += 1;
        if (volume_sweep_amount != 0)
            volume_sweep_amount = 8 - volume_sweep_amount
        if (volume_direction)
            volume_sweep_amount = -volume_sweep_amount;

        var freq_sweep_time = new Uint32Array(data.slice(offset, offset + 4))[0];
        offset += 4;
        var freq_sweep_direction = new Uint32Array(data.slice(offset, offset + 4))[0];
        offset += 4;
        var freq_sweep_shift = new Uint32Array(data.slice(offset, offset + 4))[0];
        offset += 4;
        if (freq_sweep_direction)
            freq_sweep_shift = -freq_sweep_shift;
        
        var duty = uint8data[offset];
        offset += 1;
        
        var wave_output_level = new Uint32Array(data.slice(offset, offset + 4))[0];
        offset += 4;
        var wave_waveform_index = new Uint32Array(data.slice(offset, offset + 4))[0];
        offset += 4;
        var noise_shift_clock_frequency = new Uint32Array(data.slice(offset, offset + 4))[0];
        offset += 4;
        var noise_counter_step = new Uint32Array(data.slice(offset, offset + 4))[0];
        offset += 4;
        var noise_dividing_ratio = new Uint32Array(data.slice(offset, offset + 4))[0];
        offset += 4;
        // TODO: Unreleased V4 format has some kind of "noise macro" after this data, most likely 6 bytes or integers.
        
        if (type == 0) {
            length = 64 - length;
            if (length == 64) length = 0;

            var instr = new DutyInstrument(name);
            if (length_enabled)
                instr.length = length;
            
            instr.duty_cycle = duty;
            instr.initial_volume = initial_volume;
            instr.volume_sweep_change = volume_sweep_amount;
            
            instr.frequency_sweep_time = freq_sweep_time;
            instr.frequency_sweep_shift = freq_sweep_shift;

            duty_instrument_mapping[(n % 15) + 1] = song.duty_instruments.length;
            song.duty_instruments.push(instr);
        } else if (type == 1) {
            length = 256 - length;
            if (length == 256) length = 0;

            var instr = new WaveInstrument(name);
            if (length_enabled)
                instr.length = length;
            
            instr.volume = wave_output_level;
            instr.wave_index = wave_waveform_index;

            wave_instrument_mapping[(n % 15) + 1] = song.wave_instruments.length;
            song.wave_instruments.push(instr);
        } else if (type == 2) {
            length = 64 - length;
            if (length == 64) length = 0;

            var instr = new NoiseInstrument(name);
            if (length_enabled)
                instr.length = length;
            
            instr.initial_volume = initial_volume;
            instr.volume_sweep_change = volume_sweep_amount;
    
            instr.shift_clock_mask = noise_shift_clock_frequency;
            instr.dividing_ratio = noise_dividing_ratio;
            instr.bit_count = noise_counter_step ? 7 : 15;

            noise_instrument_mapping[(n % 15) + 1] = song.noise_instruments.length;
            song.noise_instruments.push(instr);
        } else {
            console.log(n, name, type);
        }
    }
    for(var n=0; n<16; n++)
    {
        song.waves.push(Uint8Array.from(uint8data.slice(offset, offset+32)));
        offset += 32;
        if (version < 3)
            offset += 1; // older versions have an off-by-one error
    }

    song.ticks_per_row = new Uint32Array(data.slice(offset, offset + 4))[0];
    offset += 4;

    var pattern_count = new Uint32Array(data.slice(offset, offset + 4))[0];
    if (offset + pattern_count * 13 * 64 > data.length) return null;
    offset += 4;
    var patterns = []
    for(var n=0; n<pattern_count; n++)
    {
        var pattern = []
        for(var m=0; m<64; m++)
        {
            var [note, instrument, effectcode] = new Int32Array(data.slice(offset, offset + 12));
            offset += 12;
            var effectparam = uint8data[offset];
            offset += 1;
            
            pattern.push([note, instrument, effectcode, effectparam]);
        }
        patterns.push(pattern);
    }
    
    var orders = []
    for(var n=0; n<4; n++)
    {
        var order_count = new Uint32Array(data.slice(offset, offset + 4))[0]; //The amount of pattern orders stored in the file has an off-by-one.
        offset += 4;
        orders.push(new Uint32Array(data.slice(offset, offset + 4 * (order_count - 1))));
        offset += 4 * order_count;
    }
    //TODO: If version > 1 then custom routines follow.
    
    // Create proper flat patterns
    for(var n=0; n<orders[0].length; n++)
    {
        var pattern = []
        for(var m=0; m<64; m++)
        {
            var row = []
            for(var track=0; track<4; track++)
            {
                var [note, instrument, effectcode, effectparam] = patterns[orders[track][n]][m];
                var cell = new PatternCell();
                if (note != 90)
                    cell.note = note;
                if (instrument != 0)
                {
                    var mapping = null;
                    if (track < 2) mapping = duty_instrument_mapping;
                    if (track == 2) mapping = wave_instrument_mapping;
                    if (track == 3) mapping = noise_instrument_mapping;
                    if (instrument in mapping)
                        cell.instrument = mapping[instrument];
                }
                if (effectcode != 0 || effectparam != 0)
                {
                    cell.effectcode = effectcode;
                    cell.effectparam = effectparam;
                }
                row.push(cell);
            }
            pattern.push(row);
        }
        song.patterns.push(pattern);
        var added = false;
        for(var idx=0; idx<song.patterns.length-1; idx++)
        {
            if (song.patternEqual(idx, song.patterns.length-1))
            {
                song.sequence.push(idx);
                song.patterns.pop()
                added = true;
            }
        }
        if (!added)
            song.sequence.push(song.patterns.length-1);
    }
    
    //TODO: Remove unused instruments, unused waves, and deduplicate patterns.
    for(var idx=0; idx<song.duty_instruments.length; )
    {
        if (!song.usesInstrument("duty", idx))
            song.removeInstrument("duty", idx);
        else
            idx += 1;
    }
    for(var idx=0; idx<song.wave_instruments.length; )
    {
        if (!song.usesInstrument("wave", idx))
            song.removeInstrument("wave", idx);
        else
            idx += 1;
    }
    for(var idx=0; idx<song.noise_instruments.length; )
    {
        if (!song.usesInstrument("noise", idx))
            song.removeInstrument("noise", idx);
        else
            idx += 1;
    }
    
    return song;
}