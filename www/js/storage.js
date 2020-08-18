"use strict";

this.storage = new Object();
(function(storage) {

    var files = {"hardware.inc": hardware_inc, "main.asm": `
INCLUDE "hardware.inc"

SECTION "entry", ROM0[$100]
  jp start

SECTION "main", ROM0[$150]
start:
  nop
haltLoop:
  halt
  jr haltLoop
`};

    storage.autoLoad = function()
    {
        if (location.hash.length > 1) {
            var all_code = LZString.decompressFromEncodedURIComponent(location.hash.slice(1));
            if (all_code != null) {
                if (all_code.indexOf("\0") < 0) {
                    files["main.asm"] = all_code;
                } else {
                    all_code = all_code.split("\0");
                    files = {"hardware.inc": hardware_inc};
                    for(var idx=0; idx<all_code.length-1; idx+=2) {
                        files[all_code[idx]] = all_code[idx+1];
                    }
                }
            }
        }
    }

    storage.getFiles = function ()
    {
        return files;
    }

    storage.update = function(name, code)
    {
        if (code === null)
            delete files[name]
        else
            files[name] = code;
    }
    
    storage.getHashUrl = function()
    {
        var url = new URL(document.location);
        var all_code = "";
        for(var [name, data] of Object.entries(files)) {
            if (name == "hardware.inc" && data == hardware_inc)
                continue;
            all_code += name + "\0" + data + "\0";
        }
        url.hash = LZString.compressToEncodedURIComponent(all_code);
        if (url.hash.length > 1024 * 2)
            return "Sorry, code too large for direct URL generation";
        return url.toString();
    }

    storage.loadGithubGist = function(url) {
        var gist_id = urlToGistId(url);
        if (gist_id == null)
            return;

        var req = new XMLHttpRequest();
        req.open("GET", "https://api.github.com/gists/" + gist_id, false);
        req.send();
        JSON.parse(req.response);

        var result = JSON.parse(req.responseText);
        files = {"hardware.inc": hardware_inc};
        for(var [name, data] of Object.entries(result.files)) {
            files[name] = data.content;
        }
    }

    storage.saveGithubGist = function(username, token, url) {
        var gist_id = urlToGistId(url);
        if (gist_id == null)
            return;

        var req = new XMLHttpRequest();
        req.open("PATCH", "https://api.github.com/gists/" + gist_id, false);
        req.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + token));
        var file_data = {};
        for(var [name, data] of Object.entries(files))
            file_data[name] = {content: data};
        req.send(JSON.stringify({files: file_data}));
        if (req.status >= 400)
        {
            
        }
    }
    
    function urlToGistID(url) {
        var m = /https:\/\/gist\.github\.com\/\w+\/(\w+)/.exec(url);
        if (m)
            return m[1];
        return null;
    }
    
    storage.downloadZip = function() {
        var zip = new JSZip();
        for(var [name, data] of Object.entries(files))
            zip.file(name, data);
        zip.generateAsync({type:"blob"}).then(function (blob) {
            var element = document.createElement('a');
            var url = window.URL.createObjectURL(blob, {type: 'application/octet-stream'});
            element.setAttribute('href', url);
            element.setAttribute('download', "source.zip");

            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            window.URL.revokeObjectURL(url);
        });
    }
    
    storage.loadZip = function(file) {
        files = {"hardware.inc": hardware_inc};
        JSZip.loadAsync(file).then(function(zip) {
            var entries = Object.values(zip.files);
            function loadNextFile() {
                if (entries.length < 1)
                    return;
                var entry = entries.pop();
                entry.async("string").then(function(contents) {
                    files[entry.name] = contents;
                    loadNextFile();
                    //TODO: Update UI
                });
            }
            loadNextFile();
        });
    }
    
    class LocalStorageStorage {
        autoSave(name, code) {
            if (code === null)
                delete localStorage["rgbds_storage_" + name]
            else
                localStorage["rgbds_storage_" + name] = code
        }

        load() {
            for(var [name, data] of Object.entries(localStorage))
            {
                if (name.startsWith("rgbds_storage_"))
                    files[name.substr(14)] = data;
            }
        }
    }
})(storage);
