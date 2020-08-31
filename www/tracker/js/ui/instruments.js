"use strict";

class InstrumentUI
{
    constructor()
    {
        this.updateInstrumentList();
        
        document.getElementById("instrumentSelector").onclick = (e) => { this.showSelectedInstrument() };
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