"use strict";

class SequenceUI
{
    current_index = 0;

    constructor()
    {
        this.update();
        
        document.getElementById("sequence").onclick = (e) => {
            var idx = e.target.parentElement.index;
            if (typeof(idx) == "undefined") return;

            this.setCurrentSequenceIndex(idx);
            ui.tracker.loadPattern(song.sequence[idx]);
            ui.tracker.setSelectedRow(0);
        }
        
        document.getElementById("sequence_add").onclick = (e) => {
            song.sequence.push(song.addNewPattern());
            this.update();
            
            var idx = song.sequence.length - 1;
            this.setCurrentSequenceIndex(idx);
            ui.tracker.loadPattern(song.sequence[idx]);
            ui.tracker.setSelectedRow(0);
        }

        document.getElementById("sequence_del").onclick = (e) => {
            if (song.sequence.length == 1)
                return;
            song.sequence.splice(this.current_index, 1);
            this.update();
            
            var idx = this.current_index;
            if (idx == song.sequence.length)
                idx -= 1;
            this.setCurrentSequenceIndex(idx);
            ui.tracker.loadPattern(song.sequence[idx]);
            ui.tracker.setSelectedRow(0);
        }
    }

    update()
    {
        var sequence = document.getElementById("sequence");
        while(sequence.children.length > 1)
            sequence.children[1].remove();
        for(var idx=0; idx<song.sequence.length; idx++)
        {
            var row_node = document.createElement("tr");
            row_node.index = idx;
            var cell_node = document.createElement("td");
            cell_node.innerText = (idx + 1);
            row_node.appendChild(cell_node);
            cell_node = document.createElement("td");
            cell_node.innerText = song.sequence[idx];
            cell_node.contentEditable = true;
            cell_node.oninput = (e) => {
                var new_text = e.target.innerText.replace(/[^\d]/, '');
                var value = parseInt(new_text) || 0;
                if (value < 0) { value = 0; new_text = value; }
                if (value >= 32) { value = 31; new_text = value; }
                while (value >= song.patterns.length)
                    song.addNewPattern();
                if (e.target.innerText != new_text) e.target.innerText = new_text;
                song.sequence[e.target.parentElement.index] = value;
                this.updatePatternHighlight();
                ui.tracker.loadPattern(value);
                ui.tracker.setSelectedRow(0);
            }
            row_node.appendChild(cell_node);
            sequence.appendChild(row_node);
        }

        this.updatePatternHighlight();
    }
    
    setCurrentSequenceIndex(index)
    {
        this.current_index = index;
        this.updatePatternHighlight();
    }

    updatePatternHighlight()
    {
        var sequence = document.getElementById("sequence");
        for(var idx=0; idx<song.sequence.length; idx++)
        {
            if (song.sequence[idx] == song.sequence[this.current_index])
                sequence.children[idx+1].classList.add("highlight");
            else
                sequence.children[idx+1].classList.remove("highlight");
            if (idx == this.current_index)
                sequence.children[idx+1].classList.add("active");
            else
                sequence.children[idx+1].classList.remove("active");
        }
    }
};
