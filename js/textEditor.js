import {gbz80Completer} from "./ace/complete-gbz80.js";

globalThis.textEditor = new Object();
(function(editor) {
    var editors = []
    var current_file = null;
    var errors = {}
    var cpu_line_filename = null;
    var cpu_line_line_nr = null;
    var cpu_line_marker = null;
    var breakpoints = []
    var cursor_position_per_file = {}

    editor.register = function(div_id)
    {
        var e = ace.edit(div_id);
        new TokenTooltip(e);
        e.setTheme("ace/theme/tomorrow");
        e.session.setMode("ace/mode/gbz80");
        e.setOptions({
            tabSize: 2,
            useSoftTabs: true,
            navigateWithinSoftTabs: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
        });
        e.completers = [gbz80Completer]

        e.session.on('change', function(delta) {
            if (e.curOp && e.curOp.command.name)
            {
                storage.update(current_file, e.getValue());
                compileCode();
            }
        });
        e.on("guttermousedown", function(event) {
            var target = event.domEvent.target;

            if (target.className.indexOf("ace_gutter-cell") == -1)
                return;
            var row = event.getDocumentPosition().row;
            toggleBreakpoint(current_file, row + 1);
            event.stop();
        });
        
        editors.push(e);
    }
    
    editor.setCurrentFile = function(filename)
    {
        if (current_file != null)
            cursor_position_per_file[current_file] = editors[0].selection.getCursor();
        current_file = filename;
        editors[0].setValue(storage.getFiles()[filename]);
        editors[0].selection.clearSelection();
        editors[0].session.getUndoManager().reset();
        if (current_file in cursor_position_per_file)
            editors[0].selection.moveCursorToPosition(cursor_position_per_file[current_file]);
        else
            editors[0].selection.moveCursorTo(0, 0);
        editors[0].scrollToLine(editors[0].selection.getCursor().row, true);
        editors[0].focus();
        editor.updateErrors();
        updateCpuLine();
    }
    
    editor.updateErrors = function()
    {
        var annotations = [];
        for(var [type, filename, line_nr, message] of compiler.getErrors())
        {
            if (filename != current_file)
                continue;
            annotations.push({row: line_nr-1, column: 0, type: type, text: message});
        }
        editors[0].session.setAnnotations(annotations);
    }
    
    editor.setCpuLine = function(filename, line_nr, scroll_to_line)
    {
        cpu_line_filename = filename;
        cpu_line_line_nr = line_nr;
        updateCpuLine(scroll_to_line);
    }
    
    function addBreakpoint(filename, line_nr)
    {
        breakpoints.push([filename, line_nr]);
        window.updateBreakpoints();
        updateBreakpoints();
    }

    function removeBreakpoint(filename, line_nr)
    {
        breakpoints = breakpoints.filter(data => data[0] != filename || data[1] != line_nr);
        window.updateBreakpoints();
        updateBreakpoints();
    }
    
    function toggleBreakpoint(filename, line_nr)
    {
        var idx = breakpoints.findIndex(data => data[0] == filename && data[1] == line_nr);
        if (idx > -1)
            removeBreakpoint(filename, line_nr)
        else
            addBreakpoint(filename, line_nr)
    }
    
    function updateBreakpoints()
    {
        editors[0].session.clearBreakpoints();
        for(var [filename, line_nr, valid] of breakpoints)
        {
            if (filename == current_file)
                editors[0].session.setBreakpoint(line_nr - 1, valid ? "ace_breakpoint" : "ace_invalid_breakpoint");
        }
    }
    
    function updateCpuLine(scroll_to_line)
    {
        if (scroll_to_line && current_file != null && current_file != cpu_line_filename)
            editor.setCurrentFile(cpu_line_filename);

        if (cpu_line_marker != null)
        {
            editors[0].session.removeMarker(cpu_line_marker);
            cpu_line_marker = null;
        }

        if (cpu_line_filename == current_file)
        {
            cpu_line_marker = editors[0].session.addMarker(new ace.Range(cpu_line_line_nr-1, 0, cpu_line_line_nr-1, 1), "cpuLineMarker", "fullLine");
            if (scroll_to_line)
                editors[0].scrollToLine(cpu_line_line_nr-1, true, false, function() {});
        }
    }
    
    editor.getCurrentFilename = function()
    {
        return current_file;
    }
    
    editor.getBreakpoints = function()
    {
        return breakpoints;
    }
    
    editor.hide = function()
    {
        editors[0].renderer.getContainerElement().style.display = "none"
    }
    
    editor.show = function()
    {
        editors[0].renderer.getContainerElement().style.display = ""
        editors[0].resize()
        editors[0].renderer.updateFull()
    }
})(globalThis.textEditor);
