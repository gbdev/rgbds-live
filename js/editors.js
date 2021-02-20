"use strict";

this.editors = new Object();
(function(editors) {
    var nullEditor = {
        'hide': function() { document.getElementById('nullEditorDiv').style.display = "none"; },
        'show': function() { document.getElementById('nullEditorDiv').style.display = "";},
        'setCurrentFile': function() {}
    };
    var currentEditor = nullEditor;
    var currentFilename = "";

    editors.getCurrentFilename = function()
    {
        return currentFilename;
    }

    editors.setCurrentFile = function(filename)
    {
        currentFilename = filename;
        var prevEditor = currentEditor;
        if (typeof storage.getFiles()[filename] == "string")
            currentEditor = textEditor;
        else
            currentEditor = nullEditor;
        if (prevEditor != currentEditor)
        {
            if (prevEditor)
                prevEditor.hide();
            currentEditor.show();
        }
        return currentEditor.setCurrentFile(filename);
    }
    
    editors.getFileType = function(filename)
    {
        var idx = filename.lastIndexOf(".");
        if (idx < 0)
            return 'binary';
        var ext = filename.substr(idx + 1).toLowerCase();
        if (ext == "inc") return 'text';
        if (ext == "asm") return 'text';
        if (ext == "z80") return 'text';
        if (ext == "h") return 'text';
        if (ext == "c") return 'text';
        if (ext == "cpp") return 'text';
        if (ext == "hpp") return 'text';
        if (ext == "txt") return 'text';
        return 'binary'
    }
})(this.editors);
