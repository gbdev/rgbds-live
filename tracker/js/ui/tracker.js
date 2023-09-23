"use strict";

var noteName = ["C-", "C#", "D-", "D#", "E-", "F-", "F#", "G-", "G#", "A-", "A#", "B-"]
function noteToText(note)
{
    if (note === null) return "...";
    var octave = ~~(note / 12) + 3;
    return noteName[note % 12] + octave;
}
function instrumentNumberToText(instrument)
{
    if (instrument === null) return "..";
    return ("00" + (instrument + 1)).slice(-2);
}
function effectToText(effectcode, effectparam)
{
    if (effectcode === null) return "...";
    return effectcode.toString(16).toUpperCase() + ("00" + effectparam.toString(16).toUpperCase()).slice(-2);
}


class TrackerUI
{
    pattern_index = 0;
    selected_row = null;
    selected_col = null;
    selected_type = null;

    constructor()
    {
        var tracker = document.getElementById("tracker");
        var header_row = document.createElement("tr");
        var th_node = document.createElement("th");
        header_row.appendChild(th_node);
        for(var col=0; col<4; col++)
        {
            var th_node = document.createElement("th");
            if (col == 0)
                th_node.innerText = "Duty 1";
            if (col == 1)
                th_node.innerText = "Duty 2";
            if (col == 2)
                th_node.innerText = "Wave";
            if (col == 3)
                th_node.innerText = "Noise";
            th_node.col = col;
            th_node.onclick = (e) => {
                if (player.toggleMute(e.target.col))
                    e.target.classList.add("muted");
                else
                    e.target.classList.remove("muted");
            };
            header_row.appendChild(th_node);
        }
        tracker.appendChild(header_row);

        for(var row=0; row<64; row++)
        {
            var row_node = document.createElement("tr");
            var cell_node = document.createElement("td");
            cell_node.innerText = row;
            row_node.appendChild(cell_node);
            for(var col=0; col<4; col++)
            {
                var cell_node = document.createElement("td");

                var note_span = document.createElement("span");
                note_span.innerText = "...";
                note_span.className = "note";
                note_span.row = row;
                note_span.col = col;
                note_span.type = "note";
                var instrument_span = document.createElement("span");
                instrument_span.innerText = "..";
                instrument_span.className = "instrument";
                instrument_span.row = row;
                instrument_span.col = col;
                instrument_span.type = "instrument";
                var effect_span = document.createElement("span");
                effect_span.innerText = "...";
                effect_span.className = "effect";
                effect_span.row = row;
                effect_span.col = col;
                effect_span.type = "effect";

                cell_node.appendChild(note_span);
                cell_node.appendChild(instrument_span);
                cell_node.appendChild(effect_span);
                row_node.appendChild(cell_node);
            }
            tracker.appendChild(row_node);
        }
        
        document.getElementById("trackerEffectType").onchange = (e) => {
            this.setEffectType(e.target.selectedIndex > 0 ? e.target.selectedIndex - 1 : null);
        }
        document.getElementById("trackerEffectNibbleHigh").oninput = (e) => { this.setEffectParam(e.target.value << 4, 0xF0); }
        document.getElementById("trackerEffectNibbleLow").oninput = (e) => { this.setEffectParam(e.target.value, 0x0F); }
        document.getElementById("trackerEffectByte").oninput = (e) => { this.setEffectParam(e.target.value, 0xFF); }
        document.getElementById("trackerEffectWaveform").onchange = (e) => { this.setEffectParam(e.target.selectedIndex << 4, 0xF0); }
        document.getElementById("trackerEffectPanningLD1").oninput = (e) => { this.setEffectParam(e.target.checked ? 0x01 : 0x00, 0x01); }
        document.getElementById("trackerEffectPanningLD2").oninput = (e) => { this.setEffectParam(e.target.checked ? 0x02 : 0x00, 0x02); }
        document.getElementById("trackerEffectPanningLW").oninput = (e) => { this.setEffectParam(e.target.checked ? 0x04 : 0x00, 0x04); }
        document.getElementById("trackerEffectPanningLN").oninput = (e) => { this.setEffectParam(e.target.checked ? 0x08 : 0x00, 0x08); }
        document.getElementById("trackerEffectPanningRD1").oninput = (e) => { this.setEffectParam(e.target.checked ? 0x10 : 0x00, 0x10); }
        document.getElementById("trackerEffectPanningRD2").oninput = (e) => { this.setEffectParam(e.target.checked ? 0x20 : 0x00, 0x20); }
        document.getElementById("trackerEffectPanningRW").oninput = (e) => { this.setEffectParam(e.target.checked ? 0x40 : 0x00, 0x40); }
        document.getElementById("trackerEffectPanningRN").oninput = (e) => { this.setEffectParam(e.target.checked ? 0x80 : 0x00, 0x80); }
        document.getElementById("trackerEffectDutyCycle").onchange = (e) => { this.setEffectParam(e.target.selectedIndex << 6, 0xC0); }

        tracker.onclick = (e) => {
            e.preventDefault()
            e.stopPropagation()

            var row = e.target.row;
            var col = e.target.col;
            var type = e.target.type;
            if (typeof(row) == "undefined" || typeof(col) == "undefined" || typeof(type) == "undefined") return;
            this.setSelection(row, col, type);
            
            tracker.focus();
        };
        tracker.tabIndex = 0;
        tracker.onkeydown = (e) => {
            if (e.code == "F5") return;
            e.preventDefault()
            e.stopPropagation()

            if (e.code == "ArrowUp" || e.code == "Numpad8") this.moveUp();
            if (e.code == "ArrowDown" || e.code == "Numpad2") this.moveDown();
            if (e.code == "ArrowLeft" || e.code == "Numpad4") this.moveLeft();
            if (e.code == "ArrowRight" || e.code == "Numpad6") this.moveRight();
            if (e.code == "Tab") { this.moveRight(); this.moveRight(); this.moveRight(); }
            if (e.code == "PageUp" || e.code == "Numpad9") { for(var n=0; n<16; n++) this.moveUp(); }
            if (e.code == "PageDown" || e.code == "Numpad3") { for(var n=0; n<16; n++) this.moveDown(); }
            if (e.code == "Home" || e.code == "Numpad7") { this.setSelection(0, this.selected_col, this.selected_type); }
            if (e.code == "End" || e.code == "Numpad1") { this.setSelection(63, this.selected_col, this.selected_type); }
            if (e.code == "Insert" || e.code == "Numpad0") {
                song.patterns[this.pattern_index].splice(this.selected_row, 0, [new PatternCell(), new PatternCell(), new PatternCell(), new PatternCell()]);
                song.patterns[this.pattern_index].pop();
                this.loadPattern(this.pattern_index);
            }
            if (e.code == "Backspace") {
                song.patterns[this.pattern_index].splice(this.selected_row, 1);
                song.patterns[this.pattern_index].push([new PatternCell(), new PatternCell(), new PatternCell(), new PatternCell()]);
                this.loadPattern(this.pattern_index);
            }
            
            if (this.selected_type == "note")
            {
                if (e.code == "KeyQ") { this.setNote(0); this.moveDown(); }
                if (e.code == "KeyW") { this.setNote(1); this.moveDown(); }
                if (e.code == "KeyE") { this.setNote(2); this.moveDown(); }
                if (e.code == "KeyR") { this.setNote(3); this.moveDown(); }
                if (e.code == "KeyT") { this.setNote(4); this.moveDown(); }
                if (e.code == "KeyY") { this.setNote(5); this.moveDown(); }
                if (e.code == "KeyU") { this.setNote(6); this.moveDown(); }
                if (e.code == "KeyI") { this.setNote(7); this.moveDown(); }
                if (e.code == "KeyO") { this.setNote(8); this.moveDown(); }
                if (e.code == "KeyP") { this.setNote(9); this.moveDown(); }
                if (e.code == "BracketLeft") { this.setNote(10); this.moveDown(); }
                if (e.code == "BracketRight") { this.setNote(11); this.moveDown(); }
                if (e.code == "KeyA") { this.setNote(12); this.moveDown(); }
                if (e.code == "KeyS") { this.setNote(13); this.moveDown(); }
                if (e.code == "KeyD") { this.setNote(14); this.moveDown(); }
                if (e.code == "KeyF") { this.setNote(15); this.moveDown(); }
                if (e.code == "KeyG") { this.setNote(16); this.moveDown(); }
                if (e.code == "KeyH") { this.setNote(17); this.moveDown(); }
                if (e.code == "KeyJ") { this.setNote(18); this.moveDown(); }
                if (e.code == "KeyK") { this.setNote(19); this.moveDown(); }
                if (e.code == "KeyL") { this.setNote(20); this.moveDown(); }
                if (e.code == "Semicolon") { this.setNote(21); this.moveDown(); }
                if (e.code == "Quote") { this.setNote(22); this.moveDown(); }
                //if (e.code == "??") { this.setNote(23); this.moveDown(); }
                if (e.code == "KeyZ") { this.setNote(24); this.moveDown(); }
                if (e.code == "KeyX") { this.setNote(25); this.moveDown(); }
                if (e.code == "KeyC") { this.setNote(26); this.moveDown(); }
                if (e.code == "KeyV") { this.setNote(27); this.moveDown(); }
                if (e.code == "KeyB") { this.setNote(28); this.moveDown(); }
                if (e.code == "KeyN") { this.setNote(29); this.moveDown(); }
                if (e.code == "KeyM") { this.setNote(30); this.moveDown(); }
                if (e.code == "Comma") { this.setNote(31); this.moveDown(); }
                if (e.code == "Period") { this.setNote(32); this.moveDown(); }
                if (e.code == "Slash") { this.setNote(33); this.moveDown(); }
                //if (e.code == "??") this.setNote(34); this.moveDown(); }
                //if (e.code == "??") this.setNote(35); this.moveDown(); }
                if (e.code == "Delete") this.setNote(null);
            }
            if (this.selected_type == "note" || this.selected_type == "instrument")
            {
                if (e.code == "Digit1") this.setInstrument(0);
                if (e.code == "Digit2") this.setInstrument(1);
                if (e.code == "Digit3") this.setInstrument(2);
                if (e.code == "Digit4") this.setInstrument(3);
                if (e.code == "Digit5") this.setInstrument(4);
                if (e.code == "Digit6") this.setInstrument(5);
                if (e.code == "Digit7") this.setInstrument(6);
                if (e.code == "Digit8") this.setInstrument(7);
                if (e.code == "Digit9") this.setInstrument(8);
                if (e.code == "Digit0") this.setInstrument(9);
                if (this.selected_type == "instrument" && e.code == "Delete") this.setInstrument(null);
            }
            if (this.selected_type == "effect")
            {
                if (e.code == "Delete") this.setEffectType(null);
            }

            console.log(e.code);
        }
    }
    
    moveUp()
    {
        if (this.selected_row === null || this.selected_row < 1) return;
        this.setSelection(this.selected_row - 1, this.selected_col, this.selected_type);
    }
    moveDown()
    {
        if (this.selected_row === null || this.selected_row > 62) return;
        this.setSelection(this.selected_row + 1, this.selected_col, this.selected_type);
    }
    moveLeft()
    {
        if (this.selected_row === null) return;
        if (this.selected_type == "note") {
            this.setSelection(this.selected_row, (this.selected_col - 1) & 3, "effect");
        } else if (this.selected_type == "instrument") {
            this.setSelection(this.selected_row, this.selected_col, "note");
        } else if (this.selected_type == "effect") {
            this.setSelection(this.selected_row, this.selected_col, "instrument");
        }
    }
    moveRight()
    {
        if (this.selected_row === null) return;
        if (this.selected_type == "note") {
            this.setSelection(this.selected_row, this.selected_col, "instrument");
        } else if (this.selected_type == "instrument") {
            this.setSelection(this.selected_row, this.selected_col, "effect");
        } else if (this.selected_type == "effect") {
            this.setSelection(this.selected_row, (this.selected_col + 1) & 3, "note");
        }
    }
    
    setNote(value)
    {
        var cell = song.patterns[this.pattern_index][this.selected_row][this.selected_col]
        cell.note = value;
        this.getCell(this.selected_row, this.selected_col, "note").innerText = noteToText(value);
        
        if (cell.instrument === null && value !== null)
        {
            var instrument = ui.instruments.getSelectedInstrument();
            if (instrument.fitsTrack(this.selected_col))
            {
                this.setInstrument(instrument.index);
            }
        }
        
        player.updateRom();
    }
    setInstrument(value)
    {
        song.patterns[this.pattern_index][this.selected_row][this.selected_col].instrument = value;
        this.getCell(this.selected_row, this.selected_col, "instrument").innerText = instrumentNumberToText(value);
        player.updateRom();
    }
    setEffectType(value)
    {
        var c = song.patterns[this.pattern_index][this.selected_row][this.selected_col];
        c.effectcode = value;
        if (c.effectcode === null)
            c.effectparam = null;
        else if (c.effectparam === null)
            c.effectparam = 0;
        this.getCell(this.selected_row, this.selected_col, "effect").innerText = effectToText(c.effectcode, c.effectparam);
        this.setSelection(this.selected_row, this.selected_col, "effect");
        player.updateRom();
    }
    setEffectParam(value, mask)
    {
        var c = song.patterns[this.pattern_index][this.selected_row][this.selected_col];
        c.effectparam = (c.effectparam & ~mask) | (value & mask);
        this.getCell(this.selected_row, this.selected_col, "effect").innerText = effectToText(c.effectcode, c.effectparam);
        this.updateEffectInfo();
        player.updateRom();
    }
    
    setSelection(row, col, type)
    {
        if (this.selected_row !== null)
        {
            var cell = this.getCell(this.selected_row, this.selected_col, this.selected_type);
            for(var c of cell.parentElement.parentElement.children)
                for(var cc of c.children)
                    cc.classList.remove("highlight");
            cell.classList.remove("active");
        }
        this.selected_row = row;
        this.selected_col = col;
        this.selected_type = type;
        
        var cell = this.getCell(this.selected_row, this.selected_col, this.selected_type);
        cell.classList.add("active");
        for(var c of cell.parentElement.parentElement.children)
            for(var cc of c.children)
                cc.classList.add("highlight");
        cell.scrollIntoViewIfNeeded();

        var effectpopup = document.getElementById("effectpopup");
        if (type != "effect")
        {
            effectpopup.style.display = "none";
        } else {
            effectpopup.style.display = "block";
            
            var c = song.patterns[this.pattern_index][this.selected_row][this.selected_col];
            if (c.effectcode == null)
            {
                document.getElementById("trackerEffectType").selectedIndex = 0;
            } else {
                document.getElementById("trackerEffectType").selectedIndex = c.effectcode + 1;
                document.getElementById("trackerEffectNibbleLow").value = (c.effectparam & 0x0F);
                document.getElementById("trackerEffectNibbleHigh").value = (c.effectparam & 0xF0) >> 4;
                document.getElementById("trackerEffectByte").value = c.effectparam;
                document.getElementById("trackerEffectWaveform").selectedIndex = c.effectparam >> 4;
                document.getElementById("trackerEffectPanningLD1").checked = c.effectparam & 0x01;
                document.getElementById("trackerEffectPanningLD2").checked = c.effectparam & 0x02;
                document.getElementById("trackerEffectPanningLW").checked = c.effectparam & 0x04;
                document.getElementById("trackerEffectPanningLN").checked = c.effectparam & 0x08;
                document.getElementById("trackerEffectPanningRD1").checked = c.effectparam & 0x10;
                document.getElementById("trackerEffectPanningRD2").checked = c.effectparam & 0x20;
                document.getElementById("trackerEffectPanningRW").checked = c.effectparam & 0x40;
                document.getElementById("trackerEffectPanningRN").checked = c.effectparam & 0x80;
                document.getElementById("trackerEffectDutyCycle").selectedIndex = c.effectparam >> 6;
            }
            document.getElementById("trackerEffectNibbleLow").style.display = [0, 4, 5, 6, 10, 12].includes(c.effectcode) ? "" : "none";
            document.getElementById("trackerEffectNibbleHigh").style.display = [0, 5, 10].includes(c.effectcode) ? "" : "none";
            document.getElementById("trackerEffectByte").style.display = [1, 2, 3, 7, 11, 13, 14, 15].includes(c.effectcode) ? "" : "none";
            document.getElementById("trackerEffectWaveform").style.display = [4].includes(c.effectcode) ? "" : "none";
            document.getElementById("trackerEffectPanningTable").style.display = [8].includes(c.effectcode) ? "" : "none";
            document.getElementById("trackerEffectDutyCycle").style.display = [9].includes(c.effectcode) ? "" : "none";
            this.updateEffectInfo();

            if (cell.getBoundingClientRect().y < effectpopup.getBoundingClientRect().height + 16 - document.getElementById("tracker").parentElement.scrollTop)
            {
                effectpopup.style.top = cell.getBoundingClientRect().y + cell.getBoundingClientRect().height + 5 + document.getElementById("tracker").parentElement.scrollTop;
            } else {
                effectpopup.style.top = cell.getBoundingClientRect().y - effectpopup.getBoundingClientRect().height - 5 + document.getElementById("tracker").parentElement.scrollTop;
            }
        }
    }
    
    updateEffectInfo()
    {
        var info = "???";
        var c = song.patterns[this.pattern_index][this.selected_row][this.selected_col];
        if (c.effectcode === null) info = "-";
        else if (c.effectcode === 0) info = `Arpeggiate by +${c.effectparam>>4}, +${c.effectparam&0x0F} semitones`;
        else if (c.effectcode === 1) info = `Slide up by ${c.effectparam} units`;
        else if (c.effectcode === 2) info = `Slide down by ${c.effectparam} units`;
        else if (c.effectcode === 3) info = `Tone portamento by ${c.effectparam} units`;
        else if (c.effectcode === 4) info = `Depth ${c.effectparam&0x0F}`;
        else if (c.effectcode === 5) info = `Set Left speaker vol to ${c.effectparam>>4}, Right speaker vol to ${c.effectparam&0x0F}`;
        else if (c.effectcode === 6) info = `Call routine ${c.effectparam&0x0F}`;
        else if (c.effectcode === 7) info = `Delay note by ${c.effectparam} ticks`;
        else if (c.effectcode === 8) info = "";
        else if (c.effectcode === 9) info = "";
        else if (c.effectcode === 10) info = `Increase volume by ${c.effectparam>>4} units, decrease volume by ${c.effectparam&0x0F}`;
        else if (c.effectcode === 11) info = `Jump to order ${c.effectparam}`;
        else if (c.effectcode === 12) info = `Set volume to ${c.effectparam&0x0F}/15`;
        else if (c.effectcode === 13) info = `Jump to row ${c.effectparam} on the next pattern`;
        else if (c.effectcode === 14) info = `Cut note after ${c.effectparam} ticks`;
        else if (c.effectcode === 15) info = `Set speed to ${c.effectparam} ticks`;
        
        document.getElementById("trackerEffectInfo").innerText = info;
    }
    
    setSelectedRow(row)
    {
        if (this.selected_col !== null)
            this.setSelection(row, this.selected_col, this.selected_type);
        else
            this.setSelection(row, 0, "note");
    }
    
    getCell(row, col, type)
    {
        var tracker = document.getElementById("tracker");
        if (type == "note")
            return tracker.children[row+1].children[col+1].children[0];
        if (type == "instrument")
            return tracker.children[row+1].children[col+1].children[1];
        if (type == "effect")
            return tracker.children[row+1].children[col+1].children[2];
    }
    
    getPatternIndex()
    {
        return this.pattern_index;
    }
    
    loadPattern(index)
    {
        this.pattern_index = index;
        var pattern = song.patterns[index];
        var tracker = document.getElementById("tracker");
        for(var index=0; index<pattern.length; index++)
        {
            var row_node = tracker.children[index+1];
            for(var track=0; track<4; track++)
            {
                var cell_node = row_node.children[track+1];
                var cell = pattern[index][track];
                cell_node.children[0].innerText = noteToText(cell.note);
                cell_node.children[1].innerText = instrumentNumberToText(cell.instrument);
                cell_node.children[2].innerText = effectToText(cell.effectcode, cell.effectparam);
            }
        }
    }
};
