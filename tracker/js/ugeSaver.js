"use strict";

function saveUge(song)
{
    var buffer = new ArrayBuffer(1024 * 1024);
    var idx = 0;
    var view = new DataView(buffer);
    
    function addUint8(value)
    {
        view.setUint8(idx, value);
        idx += 1;
    }
    function addUint32(value)
    {
        view.setUint32(idx, value, true);
        idx += 4;
    }
    function addShortString(s)
    {
        view.setUint8(idx, s.length);
        idx += 1;
        var te = new TextEncoder()
        te.encodeInto(s, new Uint8Array(buffer, idx, idx + 255));
        idx += 255;
    }
    function addInstrument(type, i)
    {
        addUint32(type);
        if (!i)
            i = {}
        addShortString(i.name || "");
        addUint32(i.length ? i.length : 0);
        addUint8(i.length === null ? 0 : 1);
        addUint8(i.initial_volume);
        addUint32(i.volume_sweep_change < 0 ? 1 : 0);
        addUint8(i.volume_sweep_change != 0 ? 8 - Math.abs(i.volume_sweep_change) : 0);

        addUint32(i.frequency_sweep_time);
        addUint32(i.frequency_sweep_shift < 0 ? 1 : 0);
        addUint32(i.frequency_sweep_shift);

        addUint8(i.duty_cycle);

        addUint32(i.volume);
        addUint32(i.wave_index);
        
        addUint32(i.noise_shift_clock_frequency);
        addUint32(i.dividing_ratio);
        addUint32(i.bit_count == 7 ? 1 : 0);
    }
    
    addUint32(3); // version
    addShortString(song.name);
    addShortString(song.artist);
    addShortString(song.comment);
    
    for(var n=0; n<15; n++)
        addInstrument(0, song.duty_instruments[n]);
    for(var n=0; n<15; n++)
        addInstrument(1, song.wave_instruments[n]);
    for(var n=0; n<15; n++)
        addInstrument(2, song.noise_instruments[n]);
    for(var n=0; n<16; n++)
    {
        for(var m=0; m<32; m++)
            addUint8(song.waves[n] ? song.waves[n][m] : 0);
    }
    addUint32(song.ticks_per_row);
    
    addUint32(song.patterns.length * 4);
    for(var pattern of song.patterns)
    {
        for(var track=0; track<4; track++)
        {
            for(var m=0; m<64; m++)
            {
                addUint32(pattern[m][track].note === null ? 90 : pattern[m][track].note);
                addUint32(pattern[m][track].instrument === null ? 0 : pattern[m][track].instrument + 1);
                addUint32(pattern[m][track].effectcode === null ? 0 : pattern[m][track].effectcode);
                addUint8(pattern[m][track].effectparam === null ? 0 : pattern[m][track].effectparam);
            }
        }
    }
    for(var track=0; track<4; track++)
    {
        addUint32(song.sequence.length + 1); //amount of "orders" in a uge file has an off-by-one
        for(var i of song.sequence)
            addUint32(i * 4 + track);
        addUint32(0); // add the off-by-one error
    }
    for(var n=0; n<16; n++)
        addUint32(0); //Add empty routines

    downloadBlob(new Blob([buffer.slice(0, idx)]), "song.uge");
}