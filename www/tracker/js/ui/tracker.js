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
        for(var col=0; col<4; col++)
        {
            var th_node = document.createElement("th");
            th_node.innerText = col;
            header_row.appendChild(th_node);
        }
        tracker.appendChild(header_row);

        for(var row=0; row<64; row++)
        {
            var row_node = document.createElement("tr");
            //row_node.tabIndex = -1;
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
            
            if (this.selected_type == "note")
            {
                if (e.code == "KeyQ") this.setNote(0);
                if (e.code == "KeyW") this.setNote(1);
                if (e.code == "KeyE") this.setNote(2);
                if (e.code == "KeyR") this.setNote(3);
                if (e.code == "KeyT") this.setNote(4);
                if (e.code == "KeyY") this.setNote(5);
                if (e.code == "KeyU") this.setNote(6);
                if (e.code == "KeyI") this.setNote(7);
                if (e.code == "KeyO") this.setNote(8);
                if (e.code == "KeyP") this.setNote(9);
                if (e.code == "BracketLeft") this.setNote(10);
                if (e.code == "BracketRight") this.setNote(11);
                if (e.code == "KeyA") this.setNote(12);
                if (e.code == "KeyS") this.setNote(13);
                if (e.code == "KeyD") this.setNote(14);
                if (e.code == "KeyF") this.setNote(15);
                if (e.code == "KeyG") this.setNote(16);
                if (e.code == "KeyH") this.setNote(17);
                if (e.code == "KeyJ") this.setNote(18);
                if (e.code == "KeyK") this.setNote(19);
                if (e.code == "KeyL") this.setNote(20);
                if (e.code == "Semicolon") this.setNote(21);
                if (e.code == "Quote") this.setNote(22);
                //if (e.code == "??") this.setNote(23);
                if (e.code == "KeyZ") this.setNote(24);
                if (e.code == "KeyX") this.setNote(25);
                if (e.code == "KeyC") this.setNote(26);
                if (e.code == "KeyV") this.setNote(27);
                if (e.code == "KeyB") this.setNote(28);
                if (e.code == "KeyN") this.setNote(29);
                if (e.code == "KeyM") this.setNote(30);
                if (e.code == "Comma") this.setNote(31);
                if (e.code == "Period") this.setNote(32);
                if (e.code == "Slash") this.setNote(33);
                //if (e.code == "??") this.setNote(34);
                //if (e.code == "??") this.setNote(35);
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
        song.patterns[this.pattern_index][this.selected_row][this.selected_col].note = value;
        this.getCell(this.selected_row, this.selected_col, "note").innerText = noteToText(value);
    }
    setInstrument(value)
    {
        song.patterns[this.pattern_index][this.selected_row][this.selected_col].instrument = value;
        this.getCell(this.selected_row, this.selected_col, "instrument").innerText = instrumentNumberToText(value);
    }
    
    setSelection(row, col, type)
    {
        if (this.selected_row !== null)
            this.getCell(this.selected_row, this.selected_col, this.selected_type).classList.remove("active");
        this.selected_row = row;
        this.selected_col = col;
        this.selected_type = type;
        
        var cell = this.getCell(this.selected_row, this.selected_col, this.selected_type);
        cell.classList.add("active");
        cell.scrollIntoViewIfNeeded();
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
            return tracker.children[row+1].children[col].children[0];
        if (type == "instrument")
            return tracker.children[row+1].children[col].children[1];
        if (type == "effect")
            return tracker.children[row+1].children[col].children[2];
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
                var cell_node = row_node.children[track];
                var cell = pattern[index][track];
                cell_node.children[0].innerText = noteToText(cell.note);
                cell_node.children[1].innerText = instrumentNumberToText(cell.instrument);
                cell_node.children[2].innerText = effectToText(cell.effectcode, cell.effectparam);
            }
        }
    }
};
