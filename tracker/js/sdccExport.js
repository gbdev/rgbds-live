"use strict";

//TODO: Merge this code with assemblyExport, currently lots of duplication

function cHex2(n)
{
    return "0x" + ("00" + n.toString(16).toUpperCase()).slice(-2)
}

class SdccExporter
{
    constructor()
    {
        this.patterns = []
        this.pattern_map = {}
        
        this.buildPatterns();
    }
    
    getCCode()
    {
        var data = `#include "hUGEDriver.h"
#include <stddef.h>

#ifndef SONG_VAR_NAME
#define SONG_VAR_NAME song
#endif

static const unsigned char order_cnt = ${song.sequence.length * 2};
`
        for(var idx=0; idx<this.patterns.length; idx++)
        {
            data += `static const unsigned char song_pattern_${idx}[] = {\n`
            for(var cell of this.patterns[idx])
                data += `    ${this.formatPatternCell(cell)},\n`
            data += '};\n'
        }
        for(var track=0; track<4; track++)
            data += `static const unsigned char* const order${track+1}[] = {${this.getSequenceMappingFor(track)}};\n`;
        data += "static const unsigned char duty_instruments[] = {\n";
        for(var instr of song.duty_instruments)
            data += `    ${this.formatInstrument(instr)},\n`;
        data += "};\n";
        data += "static const unsigned char wave_instruments[] = {\n";
        for(var instr of song.wave_instruments)
            data += `    ${this.formatInstrument(instr)},\n`;
        data += "};\n";
        data += "static const unsigned char noise_instruments[] = {\n";
        for(var instr of song.noise_instruments)
            data += `    ${this.formatInstrument(instr)},\n`;
        data += "};\n";
        //data += "static const unsigned char routines[] = {\n";
        //TODO
        //data += "};\n";
        data += "static const unsigned char waves[] = {\n";
        for(var wave of song.waves)
            data += `    ${this.formatWave(wave)},\n`;
        data += "};\n";

        data += `
const hUGESong_t SONG_VAR_NAME = {
    ${song.ticks_per_row},
    &order_cnt,
    order1, order2, order3, order4,
    duty_instruments, wave_instruments, noise_instruments,
    NULL,
    waves
};
`
        return data;
    }
    
    getSequenceMappingFor(track)
    {
        return song.sequence.map((n) => `song_pattern_${this.pattern_map[[n, track]]}`).join(", ")
    }
    
    formatPatternCell(cell)
    {
        var note = (cell.note !== null ? cell.note : 90);
        var instrument = 0;
        var effect_code = 0;
        var effect_param = 0;
        if (cell.instrument !== null)
            instrument = cell.instrument + 1;
        if (cell.effectcode !== null)
        {
            effect_code = cell.effectcode;
            effect_param = cell.effectparam;
        }
        return `${note}, ${cHex2((instrument << 4) | effect_code)}, ${cHex2(effect_param)}`;
    }
    
    formatInstrument(instr)
    {
        if (instr instanceof DutyInstrument)
        {
            var nr10 = (instr.frequency_sweep_time << 4) | (instr.frequency_sweep_shift < 0 ? 0x08 : 0x00) | Math.abs(instr.frequency_sweep_shift);
            var nr11 = (instr.duty_cycle << 6) | ((instr.length !== null ? 64 - instr.length : 0) & 0x3f);
            var nr12 = (instr.initial_volume << 4) | (instr.volume_sweep_change > 0 ? 0x08 : 0x00);
            if (instr.volume_sweep_change != 0)
                nr12 |= 8 - Math.abs(instr.volume_sweep_change);
            var nr14 = 0x80 | (instr.length !== null ? 0x40 : 0);
            return `${cHex2(nr10)}, ${cHex2(nr11)}, ${cHex2(nr12)}, ${cHex2(nr14)}`;
        }
        if (instr instanceof WaveInstrument)
        {
            var nr31 = (instr.length !== null ? instr.length : 0) & 0xff;
            var nr32 = (instr.volume << 5);
            var wave_nr = instr.wave_index;
            var nr34 = 0x80 | (instr.length !== null ? 0x40 : 0);
            return `${cHex2(nr31)}, ${cHex2(nr32)}, ${cHex2(wave_nr)}, ${cHex2(nr34)}`;
        }
        if (instr instanceof NoiseInstrument)
        {
            var nr41 = (instr.length !== null ? 64 - instr.length : 0) & 0x3f;
            var nr42 = (instr.initial_volume << 4) | (instr.volume_sweep_change > 0 ? 0x08 : 0x00);
            if (instr.volume_sweep_change != 0)
                nr42 |= 8 - Math.abs(instr.volume_sweep_change);
            var nr43 = (instr.shift_clock_mask << 4) | ((instr.bit_count == 7) ? 0x08 : 0) | (instr.dividing_ratio);
            var nr44 = 0x80 | (instr.length !== null ? 0x40 : 0);
            return `${cHex2(nr41)}, ${cHex2(nr42)}, ${cHex2(nr43)}, ${cHex2(nr44)}`;
        }
    }
    
    formatWave(wave)
    {
        return Array.from(Array(16).keys(), (n) => cHex2((wave[n*2] << 4) | (wave[n*2+1]))).join(", ");
    }
    
    buildPatterns()
    {
        for(var n=0; n<song.patterns.length; n++)
        {
            var source_pattern = song.patterns[n];
            for(var track=0; track<4; track++)
            {
                var target_pattern = []
                for(var m=0; m<source_pattern.length; m++)
                    target_pattern.push(source_pattern[m][track]);
                
                var idx = this.findPattern(target_pattern);
                if (idx !== null) {
                    this.pattern_map[[n, track]] = idx;
                } else {
                    this.pattern_map[[n, track]] = this.patterns.length;
                    this.patterns.push(target_pattern);
                }
            }
        }
    }
    
    findPattern(pattern)
    {
        for(var idx=0; idx<this.patterns.length; idx++) {
            if (this.patternEqual(pattern, this.patterns[idx]))
                return idx;
        }
        return null;
    }
    
    patternEqual(a, b)
    {
        if (a.length != b.length) return false;
        for(var idx=0; idx<a.length; idx++) {
            if (a[idx].note != b[idx].note) return false;
            if (a[idx].instrument != b[idx].note) return false;
            if (a[idx].effectcode != b[idx].effectcode) return false;
            if (a[idx].effectparam != b[idx].effectparam) return false;
        }
        return true;
    }
};
