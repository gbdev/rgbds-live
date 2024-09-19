'use strict';

//TODO: Merge this code with assemblyExport, currently lots of duplication

function asmHex2(n) {
  return '$' + ('00' + n.toString(16).toUpperCase()).slice(-2);
}

function exportSongAsAssembly(song) {
  return new AssemblyExporter().getCompactAssembly();
}

class AssemblyExporter {
  constructor() {
    this.patterns = [];
    this.pattern_map = {};

    this.buildPatterns();
  }

  getCompactAssembly() {
    var data = `SECTION "Song Data", ROM0
_song_descriptor::
db ${song.ticks_per_row}
dw order_cnt
dw order1, order2, order3, order4
dw duty_instruments, wave_instruments, noise_instruments
dw $0000 ; routines
dw waves
order_cnt: db ${song.sequence.length * 2}
`;
    for (var track = 0; track < 4; track++) data += `order${track + 1}: ${this.getSequenceMappingFor(track)}\n`;
    for (var idx = 0; idx < this.patterns.length; idx++) {
      data += `song_pattern_${idx}:\n`;
      for (var cell of this.patterns[idx]) data += `${this.formatPatternCell(cell)}\n`;
    }
    data += 'duty_instruments:\n';
    for (var instr of song.duty_instruments) data += `${this.formatInstrument(instr)}\n`;
    data += 'wave_instruments:\n';
    for (var instr of song.wave_instruments) data += `${this.formatInstrument(instr)}\n`;
    data += 'noise_instruments:\n';
    for (var instr of song.noise_instruments) data += `${this.formatInstrument(instr)}\n`;
    //data += "routines:\n";
    //TODO
    data += 'waves:\n';
    for (var wave of song.waves) data += `${this.formatWave(wave)}\n`;
    console.log(data);
    return data;
  }

  downloadHttZip() {
    var zip = new JSZip();

    zip.file('constants.htt', `TICKS equ ${song.ticks_per_row}`);

    var data = `order_cnt: db ${song.sequence.length * 2}\n`;
    for (var track = 0; track < 4; track++) data += `order${track + 1}: ${this.getSequenceMappingFor(track)}\n`;
    zip.file('order.htt', data);

    data = '';
    for (var idx = 0; idx < this.patterns.length; idx++)
      data +=
        `song_pattern_${idx}:\n` + this.patterns[idx].map((cell) => this.formatPatternCell(cell)).join('\n') + '\n';
    zip.file('pattern.htt', data);

    zip.file('duty_instrument.htt', song.duty_instruments.map((instr) => this.formatInstrument(instr)).join('\n'));
    zip.file('wave_instrument.htt', song.wave_instruments.map((instr) => this.formatInstrument(instr)).join('\n'));
    zip.file('noise_instrument.htt', song.noise_instruments.map((instr) => this.formatInstrument(instr)).join('\n'));
    zip.file('wave.htt', song.waves.map((wave) => this.formatWave(wave)).join('\n'));
    for (var idx = 0; idx < 16; idx++) zip.file(`routine${idx}.htt`, '');

    zip.generateAsync({ type: 'blob' }).then((content) => {
      var element = document.createElement('a');
      var url = window.URL.createObjectURL(content, {
        type: 'application/octet-stream',
      });
      element.setAttribute('href', url);
      element.setAttribute('download', 'assembly.zip');

      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      window.URL.revokeObjectURL(url);
    });
  }

  getSequenceMappingFor(track) {
    return 'dw ' + song.sequence.map((n) => `song_pattern_${this.pattern_map[[n, track]]}`).join(', ');
  }

  formatPatternCell(cell) {
    var note = cell.note !== null ? cell.note : 90;
    var instrument = 0;
    var effect_code = 0;
    var effect_param = 0;
    if (cell.instrument !== null) instrument = cell.instrument + 1;
    if (cell.effectcode !== null) {
      effect_code = cell.effectcode;
      effect_param = cell.effectparam;
    }
    return `db ${note}, ${asmHex2((instrument << 4) | effect_code)}, ${asmHex2(effect_param)}`;
  }

  formatInstrument(instr) {
    if (instr instanceof DutyInstrument) {
      var nr10 =
        (instr.frequency_sweep_time << 4) |
        (instr.frequency_sweep_shift < 0 ? 0x08 : 0x00) |
        Math.abs(instr.frequency_sweep_shift);
      var nr11 = (instr.duty_cycle << 6) | ((instr.length !== null ? 64 - instr.length : 0) & 0x3f);
      var nr12 = (instr.initial_volume << 4) | (instr.volume_sweep_change > 0 ? 0x08 : 0x00);
      if (instr.volume_sweep_change != 0) nr12 |= 8 - Math.abs(instr.volume_sweep_change);
      var nr14 = 0x80 | (instr.length !== null ? 0x40 : 0);
      return `db ${asmHex2(nr10)}, ${asmHex2(nr11)}, ${asmHex2(nr12)}, ${asmHex2(nr14)}`;
    }
    if (instr instanceof WaveInstrument) {
      var nr31 = (instr.length !== null ? instr.length : 0) & 0xff;
      var nr32 = instr.volume << 5;
      var wave_nr = instr.wave_index;
      var nr34 = 0x80 | (instr.length !== null ? 0x40 : 0);
      return `db ${asmHex2(nr31)}, ${asmHex2(nr32)}, ${asmHex2(wave_nr)}, ${asmHex2(nr34)}`;
    }
    if (instr instanceof NoiseInstrument) {
      var param0 = (instr.initial_volume << 4) | (instr.volume_sweep_change > 0 ? 0x08 : 0x00);
      if (instr.volume_sweep_change != 0) param0 |= 8 - Math.abs(instr.volume_sweep_change);
      var param1 = (instr.length !== null ? 64 - instr.length : 0) & 0x3f;
      if (instr.length !== null) param1 |= 0x40;
      if (instr.bit_count == 7) param1 |= 0x80;

      return `db ${asmHex2(param0)}, ${asmHex2(param1)}, 0, 0, 0, 0, 0, 0`;
    }
  }

  formatWave(wave) {
    return 'db ' + Array.from(Array(16).keys(), (n) => asmHex2((wave[n * 2] << 4) | wave[n * 2 + 1])).join(', ');
  }

  buildPatterns() {
    for (var n = 0; n < song.patterns.length; n++) {
      var source_pattern = song.patterns[n];
      for (var track = 0; track < 4; track++) {
        var target_pattern = [];
        for (var m = 0; m < source_pattern.length; m++) target_pattern.push(source_pattern[m][track]);

        var idx = this.findPattern(target_pattern);
        if (idx !== null) {
          this.pattern_map[[n, track]] = idx;
        } else {
          this.pattern_map[[n, track]] = this.patterns.length;
          this.patterns.push(target_pattern);
        }
      }
    }
  }

  findPattern(pattern) {
    for (var idx = 0; idx < this.patterns.length; idx++) {
      if (this.patternEqual(pattern, this.patterns[idx])) return idx;
    }
    return null;
  }

  patternEqual(a, b) {
    if (a.length != b.length) return false;
    for (var idx = 0; idx < a.length; idx++) {
      if (a[idx].note != b[idx].note) return false;
      if (a[idx].instrument != b[idx].note) return false;
      if (a[idx].effectcode != b[idx].effectcode) return false;
      if (a[idx].effectparam != b[idx].effectparam) return false;
    }
    return true;
  }
}
