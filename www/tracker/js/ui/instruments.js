"use strict";

class InstrumentUI
{
    constructor()
    {
        this.updateInstrumentList();
        
        document.getElementById("instrumentSelector").onchange = (e) => { this.showSelectedInstrument() };
    }

    updateInstrumentList()
    {
        var select = document.getElementById("instrumentSelector");
        while(select.options.length > 0)
            select.options.remove(0);
        for(var idx=0; idx<song.duty_instruments.length; idx++)
        {
            var i = song.duty_instruments[idx];
            var node = document.createElement("option");
            node.innerText = `${idx+1}: ${i.name}`;
            node.value = idx;
            select.children[0].appendChild(node);
        }
        for(var idx=0; idx<song.wave_instruments.length; idx++)
        {
            var i = song.wave_instruments[idx];
            var node = document.createElement("option");
            node.innerText = `${idx+1}: ${i.name}`;
            node.value = idx;
            select.children[1].appendChild(node);
        }
        for(var idx=0; idx<song.noise_instruments.length; idx++)
        {
            var i = song.noise_instruments[idx];
            var node = document.createElement("option");
            node.innerText = `${idx+1}: ${i.name}`;
            node.value = idx;
            select.children[2].appendChild(node);
        }
        
        this.showSelectedInstrument();
    }
    
    showSelectedInstrument()
    {
        var i = this.getSelectedInstrument();
        
        for(var row of document.getElementById("instruments").children[0].children)
        {
            var t = row.getAttribute("type");
            if (t === null)
                continue;
            row.style.display = "";
            if (i instanceof DutyInstrument && t.indexOf("D") > -1)
                continue;
            if (i instanceof WaveInstrument && t.indexOf("W") > -1)
                continue;
            if (i instanceof NoiseInstrument && t.indexOf("N") > -1)
                continue;
            row.style.display = "none";
        }
        
        document.getElementById("instrumentName").value = i.name;

        document.getElementById("instrumentLength").max = (i instanceof WaveInstrument) ? 255 : 63;
        if (i.length === null)
        {
            document.getElementById("instrumentLengthEnabled").checked = false;
            document.getElementById("instrumentLength").value = 0;
        }else{
            document.getElementById("instrumentLengthEnabled").checked = true;
            document.getElementById("instrumentLength").value = i.length;
        }
        
        if (i instanceof DutyInstrument || i instanceof NoiseInstrument)
        {
            document.getElementById("instrumentInitialVolume").value = i.initial_volume;
            document.getElementById("instrumentVolumeChange").value = i.volume_sweep_change;
        }
        if (i instanceof DutyInstrument)
        {
            document.getElementById("instrumentSweepTime").selectedIndex = i.frequency_sweep_time;
            document.getElementById("instrumentSweepChange").value = i.frequency_sweep_shift;

            document.getElementById("instrumentDuty").selectedIndex = i.duty_cycle;
        }
        else if (i instanceof WaveInstrument)
        {
            document.getElementById("instrumentWaveVolume").selectedIndex = i.volume;
            document.getElementById("instrumentWaveIndex").selectedIndex = i.wave_index;
        }
        else if (i instanceof NoiseInstrument)
        {
            document.getElementById("instrumentNoiseShiftClockMask").value = i.shift_clock_mask;
            document.getElementById("instrumentNoiseDividingRatio").value = i.dividing_ratio;
            document.getElementById("instrumentNoise7bit").checked = i.bit_count == 7;
        }
        this.updateDrawings()
    }
    
    updateDrawings()
    {
        var i = this.getSelectedInstrument();
        
        if (i instanceof DutyInstrument || i instanceof NoiseInstrument)
        {
            var points = [];
            var value = i.initial_volume / 15.0;
            for(var n=0; n<64; n++)
            {
                points.push(value);
                value += i.volume_sweep_change / 15.0;
                if (i.length !== null && n > i.length)
                    value = 0;
            }
            this.renderCanvas("instrumentVolumeCanvas", points)
        }
    }
    
    renderCanvas(id, points)
    {
        var canvas = document.getElementById(id);
        var w = canvas.width;
        var h = canvas.height;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3
        ctx.moveTo(0, h - Math.max(0.0, Math.min(1.0, points[0])) * h);
        for(var idx=1; idx<points.length; idx++)
        {
            ctx.lineTo(w*idx/(points.length-1), h - Math.max(0.0, Math.min(1.0, points[idx])) * h);
        }
        ctx.stroke();
    }
    
    getSelectedInstrument()
    {
        var select = document.getElementById("instrumentSelector");
        var option = select.selectedOptions[0];
        if (option.parentElement.label == "Duty")
            return song.duty_instruments[option.value];
        if (option.parentElement.label == "Wave")
            return song.wave_instruments[option.value];
        if (option.parentElement.label == "Noise")
            return song.noise_instruments[option.value];
        return null;
    }
}