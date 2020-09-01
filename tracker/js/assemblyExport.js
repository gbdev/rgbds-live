"use strict";

function asmHex2(n)
{
    return "$" + ("00" + n.toString(16).toUpperCase()).slice(-2)
}

function exportSongAsAssembly(song)
{
    var data = `SECTION "Song Data", ROM0
_song_descriptor::
db ${song.ticks_per_row}
dw order_cnt
dw _order1, _order2, _order3, _order4
dw duty_instruments, wave_instruments, noise_instruments
dw routines
dw waves
order_cnt: db ${song.sequence.length * 2}
`
    for(var track=0; track<4; track++)
        data += `_order${track+1}: dw ` + song.sequence.map((n) => `PAT_${track}_${n}`).join(", ") + "\n";
    for(var track=0; track<4; track++)
    {
        for(var n=0; n<song.patterns.length; n++)
        {
            var pattern = song.patterns[n];
            data += `PAT_${track}_${n}:\n`;
            for(var m=0; m<pattern.length; m++)
            {
                var cell = pattern[m][track];
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
                data += `db ${note}, ${asmHex2((instrument << 4) | effect_code)}, ${asmHex2(effect_param)}\n`;
            }
        }
    }
    data += "duty_instruments:\n";
    for(var instr of song.duty_instruments)
    {
        var nr10 = (instr.frequency_sweep_time << 4) | (instr.frequency_sweep_shift < 0 ? 0x08 : 0x00) | Math.abs(instr.frequency_sweep_shift);
        var nr11 = (instr.duty_cycle << 6) | ((instr.length !== null ? 64 - instr.length : 0) & 0x3f);
        var nr12 = (instr.initial_volume << 4) | (instr.volume_sweep_change > 0 ? 0x08 : 0x00);
        if (instr.volume_sweep_change != 0)
            nr12 |= 8 - Math.abs(instr.volume_sweep_change);
        var nr14 = 0x80 | (instr.length !== null ? 0x40 : 0);
        data += `db ${asmHex2(nr10)}, ${asmHex2(nr11)}, ${asmHex2(nr12)}, ${asmHex2(nr14)}\n`;
    }
    data += "wave_instruments:\n";
    for(var instr of song.wave_instruments)
    {
        var nr31 = (instr.length !== null ? instr.length : 0) & 0xff;
        var nr32 = (instr.volume << 5);
        var wave_nr = instr.wave_index;
        var nr34 = 0x80 | (instr.length !== null ? 0x40 : 0);
        data += `db ${asmHex2(nr31)}, ${asmHex2(nr32)}, ${asmHex2(wave_nr)}, ${asmHex2(nr34)}\n`;
    }
    data += "noise_instruments:\n";
    for(var instr of song.noise_instruments)
    {
        var nr41 = (instr.length !== null ? 64 - instr.length : 0) & 0x3f;
        var nr42 = (instr.initial_volume << 4) | (instr.volume_sweep_change > 0 ? 0x08 : 0x00);
        if (instr.volume_sweep_change != 0)
            nr42 |= 8 - Math.abs(instr.volume_sweep_change);
        var nr43 = (instr.shift_clock_mask << 4) | ((instr.bit_count == 7) ? 0x08 : 0) | (instr.dividing_ratio);
        var nr44 = 0x80 | (instr.length !== null ? 0x40 : 0);
        data += `db ${asmHex2(nr41)}, ${asmHex2(nr42)}, ${asmHex2(nr43)}, ${asmHex2(nr44)}\n`;
    }
    data += "routines:\n";
    data += "waves:\n";
    for(var wave of song.waves)
    {
        data += "db ";
        for(var n=0; n<16; n++)
        {
            if (n > 0) data += ", ";
            data += asmHex2((wave[n*2] << 4) | (wave[n*2+1]));
        }
        data += "\n";
    }
    console.log(data);
    return data;
}