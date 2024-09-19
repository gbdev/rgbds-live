import * as storage from "./storage.js";
import * as textEditor from "./text-editor.js";
import * as gfxEditor from "./gfx-editor.js";

var nullEditor = {
  hide: function () {
    document.getElementById("nullEditorDiv").style.display = "none";
  },
  show: function () {
    document.getElementById("nullEditorDiv").style.display = "";
  },
  setCurrentFile: function () {},
};
var currentEditor = nullEditor;
var currentFilename = "";

export function getCurrentFilename() {
  return currentFilename;
}

export function setCurrentFile(filename) {
  currentFilename = filename;
  var prevEditor = currentEditor;
  if (typeof storage.getFiles()[filename] == "string")
    currentEditor = textEditor;
  else currentEditor = gfxEditor;
  if (prevEditor != currentEditor) {
    prevEditor.hide();
    currentEditor.show();
  }
  return currentEditor.setCurrentFile(filename);
}

export function getFileType(filename) {
  var idx = filename.lastIndexOf(".");
  if (idx < 0) return "binary";
  var ext = filename.substr(idx + 1).toLowerCase();
  if (ext == "inc") return "text";
  if (ext == "asm") return "text";
  if (ext == "z80") return "text";
  if (ext == "h") return "text";
  if (ext == "c") return "text";
  if (ext == "cpp") return "text";
  if (ext == "hpp") return "text";
  if (ext == "txt") return "text";
  return "binary";
}
