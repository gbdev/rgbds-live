import { require } from './loader.js';
import { gameboy_hardware_constants } from '../gbz80.js';

const { TextHighlightRules } = await require('ace/mode/text_highlight_rules');

const constants_re = '\\b(?:' + Object.keys(gameboy_hardware_constants).join('|') + ')\\b';

export class GBZ80HighlightRules extends TextHighlightRules {
  constructor() {
    super();

    this.$rules = {
      start: [
        {
          token: 'keyword.control.assembly',
          regex:
            '\\b(?:ADC|ADD|AND|BIT|CALL|CCF|CP|CPL|DAA|DEC|DI|EI|HALT|INC|JP|JR|LD|LDD|LDH|LDI|LDIO|NOP|OR|POP|PUSH|RES|RET|RETI|RL|RLA|RLC|RLCA|RR|RRA|RRC|RRCA|RST|SBC|SCF|SET|SLA|SRA|SRL|STOP|SUB|SWAP|XOR)\\b',
          caseInsensitive: true,
        },
        {
          token: 'keyword.control.sections',
          regex: '\\b(?:HRAM|OAM|ROM0|ROMX|SRAM|VRAM|WRAM0|WRAMX)\\b',
          caseInsensitive: true,
        },
        {
          token: 'keyword.control.reserved',
          regex:
            '\\b(?:ACOS|ALIGN|ASIN|ASSERT|ATAN|ATAN2|BANK|BITWIDTH|BREAK|CEIL|CHARCMP|CHARLEN|CHARMAP|CHARSIZE|CHARSUB|CHARVAL|COS|DB|DEF|DIV|DL|DS|DW|ELIF|ELSE|ENDC|ENDL|ENDM|ENDR|ENDSECTION|ENDU|EQU|EQUS|EXPORT|FAIL|FATAL|FLOOR|FMOD|FOR|FRAGMENT|HIGH|IF|INCBIN|INCHARMAP|INCLUDE|ISCONST|LOAD|LOG|LOW|MACRO|MUL|NEWCHARMAP|NEXTU|OPT|POPC|POPO|POPS|POW|PRINT|PRINTLN|PURGE|PUSHC|PUSHO|PUSHS|RB|REDEF|REPT|REVCHAR|ROUND|RSRESET|RSSET|RW|SECTION|SETCHARMAP|SHIFT|SIN|SIZEOF|STARTOF|STATIC_ASSERT|STRCAT|STRCHAR|STRCMP|STRFIND|STRFMT|STRIN|STRLEN|STRLWR|STRRFIND|STRRIN|STRRPL|STRSLICE|STRSUB|STRUPR|TAN|TZCOUNT|UNION|WARN)\\b',
          caseInsensitive: true,
        },
        {
          token: 'variable.constant',
          regex: constants_re,
          caseInsensitive: true,
        },
        {
          token: 'variable.parameter.register.assembly',
          regex: '\\b(?:A|B|C|D|E|H|L|AF|BC|DE|HL|HLD|HLI|SP)\\b',
          caseInsensitive: true,
        },
        {
          token: 'variable.parameter.condition.assembly',
          regex: '\\b(?:Z|NZ|NC)\\b',
          caseInsensitive: true,
        },
        { token: 'constant.numeric.decimal.assembly', regex: '\\b[0-9]+\\b' },
        { token: 'constant.numeric.binary.assembly', regex: '\\%[0-1]+\\b' },
        {
          token: 'constant.numeric.binary.assembly',
          regex: '\\b0b[0-1]+\\b',
          caseInsensitive: true,
        },
        {
          token: 'constant.numeric.quaternary.assembly',
          regex: '\\`[0-3]+\\b',
        },
        { token: 'constant.numeric.octal.assembly', regex: '\\&[0-7]+\\b' },
        {
          token: 'constant.numeric.octal.assembly',
          regex: '\\b0o[0-7]+\\b',
          caseInsensitive: true,
        },
        {
          token: 'constant.numeric.hexadecimal.assembly',
          regex: '\\$[0-9A-F]+\\b',
          caseInsensitive: true,
        },
        {
          token: 'constant.numeric.hexadecimal.assembly',
          regex: '\\b0x[0-9A-F]+\\b',
          caseInsensitive: true,
        },
        { token: 'string.assembly', regex: /"([^\\"]|\\.)*"/ },
        { token: 'entity.name.function.assembly', regex: '^\\s*%%[\\w.]+?:$' },
        {
          token: 'entity.name.function.assembly',
          regex: '^\\s*%\\$[\\w.]+?:$',
        },
        { token: 'entity.name.function.assembly', regex: '^[\\w.]+?:' },
        //{ token: 'entity.name.function.assembly', regex: '^[\\w.]+?\\b' },
        { token: 'comment.assembly', regex: ';.*$' },
      ],
    };

    this.normalizeRules();
  }

  static metaData = {
    fileTypes: ['asm'],
    name: 'Game Boy SM83',
    scopeName: 'source.assembly',
  };
}

const { FoldMode: BaseFoldMode } = await require('ace/mode/folding/coffee');
class FoldMode extends BaseFoldMode {
  constructor() {
    super();
  }

  getFoldWidgetRange(session, foldStyle, row) {
    var range = this.indentationBlock(session, row);
    if (range) return range;

    var re = /\S/;
    var line = session.getLine(row);
    var startLevel = line.search(re);
    if (startLevel == -1 || line[startLevel] != '#') return;

    var startColumn = line.length;
    var maxRow = session.getLength();
    var startRow = row;
    var endRow = row;

    while (++row < maxRow) {
      line = session.getLine(row);
      var level = line.search(re);

      if (level == -1) continue;

      if (line[level] != '#') break;

      endRow = row;
    }

    if (endRow > startRow) {
      var endColumn = session.getLine(endRow).length;
      return new ace.Range(startRow, startColumn, endRow, endColumn);
    }
  }

  getFoldWidget(session, foldStyle, row) {
    var line = session.getLine(row);
    var indent = line.search(/\S/);
    var next = session.getLine(row + 1);
    var prev = session.getLine(row - 1);
    var prevIndent = prev.search(/\S/);
    var nextIndent = next.search(/\S/);

    if (indent == -1) {
      session.foldWidgets[row - 1] = prevIndent != -1 && prevIndent < nextIndent ? 'start' : '';
      return '';
    }
    if (prevIndent == -1) {
      if (indent == nextIndent && line[indent] == '#' && next[indent] == '#') {
        session.foldWidgets[row - 1] = '';
        session.foldWidgets[row + 1] = '';
        return 'start';
      }
    } else if (prevIndent == indent && line[indent] == '#' && prev[indent] == '#') {
      if (session.getLine(row - 2).search(/\S/) == -1) {
        session.foldWidgets[row - 1] = 'start';
        session.foldWidgets[row + 1] = '';
        return '';
      }
    }

    if (prevIndent != -1 && prevIndent < indent) session.foldWidgets[row - 1] = 'start';
    else session.foldWidgets[row - 1] = '';

    if (indent < nextIndent) return 'start';
    else return '';
  }
}

const { Mode: TextMode } = await require('ace/mode/text');
export class GBZ80Mode extends TextMode {
  static lineCommentStart = [';'];
  static $id = 'ace/mode/gbz80';

  constructor() {
    super();
    this.HighlightRules = GBZ80HighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
  }
}

ace.define('ace/mode/gbz80', ['exports'], (exports) => Object.assign(exports, { Mode: GBZ80Mode }));
