"use strict";

this.editors = new Object();
(function(editors) {
    editors.getCurrentFilename = function()
    {
        return textEditor.getCurrentFilename();
    }

    editors.setCurrentFile = function(filename)
    {
        return textEditor.setCurrentFile(filename);
    }
})(this.editors);
