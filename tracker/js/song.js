"use strict";

class Song
{
    constructor()
    {
        this.name = "";
        this.artist = "";
        this.comment = "";
        this.filename = "song";
        
        this.duty_instruments = [];
        this.wave_instruments = [];
        this.noise_instruments = [];
        this.waves = [];
        this.ticks_per_row = 6;
        
        this.patterns = [];
        this.sequence = [];
    }
    
    createDefaults()
    {
        this.addNewPattern();
        this.sequence = [0];
    
        for(var [sweep_value, sweep_name] of [[0, ""], [-7, " plink"]])
        {
            for(var [duty_value, duty_name] of [[0, "12.5%"], [1, "25%"], [2, "50%"], [3, "75%"]])
            {
                var i = new DutyInstrument(`Duty ${duty_name}${sweep_name}`);
                i.duty_cycle = duty_value;
                i.volume_sweep_change = sweep_value;
                this.addInstrument(i);
            }
        }
        for(var [wave_index, wave_name] of [[0, "Square wave 12.5%"], [1, "Square wave 25%"], [2, "Square wave 50%"], [3, "Square wave 75%"], [4, "Sawtooth wave"], [5, "Triangle wave"], [6, "Sine wave"], [7, "Toothy"], [8, "Triangle Toothy"], [9, "Pointy"], [10, "Strange"]])
        {
            var i = new WaveInstrument(`${wave_name}`);
            i.wave_index = wave_index;
            this.addInstrument(i);
        }
        this.addInstrument(new NoiseInstrument("Noise"));
        
        this.waves.push([0x0,0x0,0x0,0x0,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf]);
        this.waves.push([0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf]);
        this.waves.push([0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf]);
        this.waves.push([0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0xf,0xf,0xf,0xf,0xf,0xf,0xf,0xf]);
        this.waves.push([0x0,0x0,0x0,0x1,0x1,0x2,0x2,0x3,0x3,0x4,0x4,0x5,0x5,0x6,0x6,0x7,0x7,0x8,0x8,0x9,0x9,0xa,0xa,0xb,0xb,0xc,0xc,0xd,0xd,0xe,0xe,0xf]);
        this.waves.push([0xf,0xe,0xd,0xc,0xb,0xa,0x9,0x8,0x7,0x6,0x5,0x4,0x3,0x2,0x1,0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xa,0xb,0xc,0xd,0xe,0xf,0xf]);
        this.waves.push([0x7,0xa,0xc,0xd,0xd,0xb,0x7,0x5,0x2,0x1,0x1,0x3,0x6,0x8,0xb,0xd,0xd,0xc,0x9,0x7,0x4,0x1,0x0,0x1,0x4,0x7,0x9,0xc,0xd,0xd,0xb,0x8]);
        this.waves.push([0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf,0x0,0xf]);
        this.waves.push([0xf,0xe,0xf,0xc,0xf,0xa,0xf,0x8,0xf,0x6,0xf,0x4,0xf,0x2,0xf,0x0,0xf,0x2,0xf,0x4,0xf,0x6,0xf,0x8,0xf,0xa,0xf,0xc,0xf,0xe,0xf,0xf]);
        this.waves.push([0xf,0xe,0xd,0xd,0xc,0xc,0xb,0xb,0xa,0xa,0x9,0x9,0x8,0x8,0x7,0x7,0x8,0xa,0xb,0xd,0xf,0x1,0x2,0x4,0x5,0x7,0x8,0xa,0xb,0xd,0xe,0xe]);
        this.waves.push([0x8,0x4,0x1,0x1,0x6,0x1,0xe,0xd,0x5,0x7,0x4,0x7,0x5,0xa,0xa,0xd,0xc,0xe,0xa,0x3,0x1,0x7,0x7,0x9,0xd,0xd,0x2,0x0,0x0,0x3,0x4,0x7]);
    }
    
    addInstrument(instrument)
    {
        var list = null;
        if (instrument instanceof DutyInstrument)
            list = this.duty_instruments;
        if (instrument instanceof WaveInstrument)
            list = this.wave_instruments;
        if (instrument instanceof NoiseInstrument)
            list = this.noise_instruments;
        instrument.index = list.length;
        list.push(instrument);
    }
    
    usesInstrument(type, index)
    {
        var list = null;
        var cols = []
        if (type == "duty") { list = this.duty_instruments; cols = [0, 1]; }
        if (type == "wave") { list = this.wave_instruments; cols = [2]; }
        if (type == "noise") { list = this.noise_instruments; cols = [3]; }

        for(var pattern of this.patterns) {
            for(var row of pattern) {
                for(var col of cols) {
                    if (row[col].instrument == index) return true;
                }
            }
        }
        return false;
    }
    
    removeInstrument(type, index)
    {
        var list = null;
        var cols = []
        if (type == "duty") { list = this.duty_instruments; cols = [0, 1]; }
        if (type == "wave") { list = this.wave_instruments; cols = [2]; }
        if (type == "noise") { list = this.noise_instruments; cols = [3]; }

        for(var pattern of this.patterns) {
            for(var row of pattern) {
                for(var col of cols) {
                    if (row[col].instrument == index) row[col].instrument = null;
                    if (row[col].instrument > index) row[col].instrument -= 1;
                }
            }
        }
        list.splice(index, 1);
        for(var idx=0; idx<list.length; idx++)
            list[idx].index = idx;
    }
    
    addNewPattern()
    {
        var pattern = [];
        for(var n=0; n<64; n++)
            pattern.push([new PatternCell(), new PatternCell(), new PatternCell(), new PatternCell()]);
        this.patterns.push(pattern);
        return this.patterns.length - 1;
    }

    patternEqual(idx0, idx1)
    {
        var a = this.patterns[idx0];
        var b = this.patterns[idx1];
        if (a.length != b.length)
            return false;
        for(var idx=0; idx<a.length; idx++)
        {
            for(var col=0; col<4; col++)
            {
                if (a[idx][col].note != b[idx][col].note) return false;
                if (a[idx][col].instrument != b[idx][col].instrument) return false;
                if (a[idx][col].effectcode != b[idx][col].effectcode) return false;
                if (a[idx][col].effectparam != b[idx][col].effectparam) return false;
            }
        }
        return true;
    }
}
class DutyInstrument
{
    constructor(name)
    {
        this.name = name;
        this.length = null;

        this.duty_cycle = 2;

        this.initial_volume = 15;
        this.volume_sweep_change = 0;
        
        this.frequency_sweep_time = 0;
        this.frequency_sweep_shift = 0;
    }
    
    fitsTrack(track)
    {
        return track == 0 || track == 1;
    }
}
class WaveInstrument
{
    constructor(name)
    {
        this.name = name;
        this.length = null;

        this.volume = 1;
        this.wave_index = 0;
    }

    fitsTrack(track)
    {
        return track == 2;
    }
}
class NoiseInstrument
{
    constructor(name)
    {
        this.name = name;
        this.length = null;

        this.initial_volume = 15;
        this.volume_sweep_change = 0;
        
        this.shift_clock_mask = 0;
        this.dividing_ratio = 0;
        this.bit_count = 15;
    }

    fitsTrack(track)
    {
        return track == 3;
    }
}
class PatternCell
{
    constructor()
    {
        this.note = null;
        this.instrument = null;
        this.effectcode = null;
        this.effectparam = null;
    }
}