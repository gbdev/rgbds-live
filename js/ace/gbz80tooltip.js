import { gameboy_hardware_constants } from '../gbz80.js';
import ace, { require } from './loader.js';

const { Tooltip } = await require('ace/tooltip');
const AceEvent = await require('ace/lib/event');

export class TokenTooltip extends Tooltip {
  token = {};
  range = new ace.Range();
  constructor(editor) {
    super(editor.container);
    if (editor.tokenTooltip) return;
    editor.tokenTooltip = this;
    this.editor = editor;

    this.update = this.update.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    AceEvent.addListener(editor.renderer.scroller, 'mousemove', this.onMouseMove);
    AceEvent.addListener(editor.renderer.content, 'mouseout', this.onMouseOut);
  }

  update() {
    this.$timer = null;

    var r = this.editor.renderer;
    if (this.lastT - (r.timeStamp || 0) > 1000) {
      r.rect = null;
      r.timeStamp = this.lastT;
      this.maxHeight = window.innerHeight;
      this.maxWidth = window.innerWidth;
    }

    var canvasPos = r.rect || (r.rect = r.scroller.getBoundingClientRect());
    var offset = (this.x + r.scrollLeft - canvasPos.left - r.$padding) / r.characterWidth;
    var row = Math.floor((this.y + r.scrollTop - canvasPos.top) / r.lineHeight);
    var col = Math.round(offset);

    var screenPos = { row: row, column: col, side: offset - col > 0 ? 1 : -1 };
    var session = this.editor.session;
    var docPos = session.screenToDocumentPosition(screenPos.row, screenPos.column);
    var token = session.getTokenAt(docPos.row, docPos.column);

    if (!token && !session.getLine(docPos.row)) {
      token = {
        type: '',
        value: '',
        state: session.bgTokenizer.getState(0),
      };
    }
    if (!token) {
      this.hide();
      return;
    }

    var tokenText = '';
    if (token.type == 'variable.constant' && token.value in gameboy_hardware_constants) {
      var info = gameboy_hardware_constants[token.value];
      tokenText = info.description;
      if (info.value) tokenText += '\nValue: ' + info.value;
      if (info.flags) {
        tokenText += '\n';
        for (var flag in info.flags) tokenText += '\n' + flag + ': ' + info.flags[flag].description;
      }
    } else {
      this.hide();
      return;
    }

    if (this.tokenText != tokenText) {
      this.setText(tokenText);
      this.width = this.getWidth();
      this.height = this.getHeight();
      this.tokenText = tokenText;
    }

    this.show(null, this.x, this.y);

    this.token = token;
  }

  onMouseMove(e) {
    this.x = e.clientX;
    this.y = e.clientY;
    if (this.isOpen) {
      this.lastT = e.timeStamp;
      this.setPosition(this.x, this.y);
    }
    if (!this.$timer) this.$timer = setTimeout(this.update, 100);
  }

  onMouseOut(e) {
    if (e && e.currentTarget.contains(e.relatedTarget)) return;
    this.hide();
    this.$timer = clearTimeout(this.$timer);
  }

  setPosition(x, y) {
    if (x + 10 + this.width > this.maxWidth) x = window.innerWidth - this.width - 10;
    if (y > window.innerHeight * 0.75 || y + 20 + this.height > this.maxHeight)
      y = y - this.height - 30;

    Tooltip.prototype.setPosition.call(this, x + 10, y + 20);
  }

  destroy() {
    this.onMouseOut();
    event.removeListener(this.editor.renderer.scroller, 'mousemove', this.onMouseMove);
    event.removeListener(this.editor.renderer.content, 'mouseout', this.onMouseOut);
    delete this.editor.tokenTooltip;
  }
}
