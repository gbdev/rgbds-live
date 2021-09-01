"use strict";

this.storage = new Object();
(function(storage) {

    var files = {"hardware.inc": hardware_inc, "main.asm": `INCLUDE "hardware.inc"

SECTION "entry", ROM0[$100]
  jp start

SECTION "main", ROM0[$150]
start:
  nop
haltLoop:
  halt
  jr haltLoop
`};
    storage.autoUrl = false;
    storage.autoLocalStorage = false;

    storage.reset = function()
    {
        files = {"hardware.inc": hardware_inc, "main.asm": `INCLUDE "hardware.inc"

SECTION "entry", ROM0[$100]
  jp start

SECTION "main", ROM0[$150]
start:
  nop
haltLoop:
  halt
  jr haltLoop
`}
    }

    storage.autoLoad = function()
    {
        if (location.hash.length > 1) {
            if (location.hash.startsWith("#https://gist.github.com/")) {
                storage.loadGithubGist(location.hash.slice(1));
                location.hash = "";
            } else if (location.hash.startsWith("#http://") || location.hash.startsWith("#https://")) {
                storage.loadSingleUrl(location.hash.slice(1));
                location.hash = "";
            } else {
                storage.loadUrlHash();
                storage.autoUrl = true;
            }
        } else if ("rgbds_storage" in localStorage) {
            files = {"hardware.inc": hardware_inc};
            for(var [filename, data] of Object.entries(JSON.parse(localStorage["rgbds_storage"]))) {
                if (data instanceof Object)
                    data = Uint8Array.from(Object.values(data));
                files[filename] = data;
            }
            storage.autoLocalStorage = true;
        }
    }

    storage.getFiles = function ()
    {
        return files;
    }

    storage.update = function(name, code)
    {
        if (typeof(name) !== "undefined")
        {
            if (code instanceof ArrayBuffer)
                code = new Uint8Array(code);
            if (code === null)
                delete files[name]
            else
                files[name] = code;
        }
        
        if (storage.autoUrl)
            document.location.hash = new URL(storage.getHashUrl()).hash;
        if (storage.autoLocalStorage)
            localStorage["rgbds_storage"] = JSON.stringify(files);
    }

    storage.loadUrlHash = function() {
        var all_code = LZString.decompressFromEncodedURIComponent(location.hash.slice(1));
        if (all_code == null)
            return false;

        if (all_code.indexOf("\0") < 0) {
            files["main.asm"] = all_code;
            return true;
        }
        all_code = all_code.split("\0");
        files = {"hardware.inc": hardware_inc};
        for(var idx=0; idx<all_code.length-1; idx+=2) {
            files[all_code[idx]] = all_code[idx+1];
        }
        return true;
    }
    
    storage.getHashUrl = function()
    {
        var all_code = "";
        for(var [name, data] of Object.entries(files)) {
            if (name == "hardware.inc" && data == hardware_inc)
                continue;
            all_code += name + "\0" + data + "\0";
        }
        var url = new URL(document.location);
        url.hash = LZString.compressToEncodedURIComponent(all_code);
        if (url.hash.length > 1024 * 2)
            return "Sorry, code too large for direct URL generation";
        return url.toString();
    }

    function urlToGistID(url) {
        var m = /https:\/\/gist\.github\.com\/\w+\/(\w+)/.exec(url);
        if (m)
            return m[1];
        return null;
    }

    storage.loadGithubGist = function(url) {
        var gist_id = urlToGistID(url);
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
        postLoadUIUpdate();
    }

    storage.saveGithubGist = function(username, token, url) {
        var file_data = {};
        for(var [name, data] of Object.entries(files))
            file_data[name] = {content: data};

        if (url == "")
        {
            var req = new XMLHttpRequest();
            req.open("POST", "https://api.github.com/gists", false);
            req.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + token));
            req.send(JSON.stringify({files: file_data}));
            if (req.status >= 400)
            {
                return null;
            }
            return JSON.parse(req.response).html_url;
        }

        var gist_id = urlToGistID(url);
        if (gist_id == null)
            return null;

        var req = new XMLHttpRequest();
        req.open("PATCH", "https://api.github.com/gists/" + gist_id, false);
        req.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + token));
        req.send(JSON.stringify({files: file_data}));
        if (req.status >= 400)
        {
            return null;
        }
        return url;
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
                var type = editors.getFileType(entry.name) == 'text' ? "string" : "uint8array";
                entry.async(type).then(function(contents) {
                    files[entry.name] = contents;
                    loadNextFile();
                    postLoadUIUpdate();
                });
            }
            loadNextFile();
        });
    }
    
    storage.loadSingleUrl = function(url) {
        files = {"hardware.inc": hardware_inc};
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send();
        files["main.asm"] = req.response;
        postLoadUIUpdate();
    }
    
    function postLoadUIUpdate() {
        editors.setCurrentFile(Object.keys(files)[0]);
        updateFileList();
    }
})(storage);
