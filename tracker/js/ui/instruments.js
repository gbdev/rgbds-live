"use strict";

class InstrumentUI {
  constructor() {
    this.updateInstrumentList();

    document.getElementById("instrumentSelector").onchange = (e) => {
      this.showSelectedInstrument();
    };

    document.getElementById("instrumentName").oninput = (e) => {
      this.getSelectedInstrument().name = e.target.value;
      var tmp = document.getElementById("instrumentSelector").selectedIndex;
      this.updateInstrumentList();
      document.getElementById("instrumentSelector").selectedIndex = tmp;
      this.showSelectedInstrument();
    };
    document.getElementById("instrumentLengthEnabled").onchange = (e) => {
      if (e.target.checked) {
        this.getSelectedInstrument().length = 32;
        document.getElementById("instrumentLength").value =
          this.getSelectedInstrument().length;
      } else {
        this.getSelectedInstrument().length = null;
        document.getElementById("instrumentLength").value = 0;
      }
      this.updateDrawings();
      player.updateRom();
    };
    document.getElementById("instrumentLength").oninput = (e) => {
      this.getSelectedInstrument().length = e.target.value;
      document.getElementById("instrumentLengthEnabled").checked = true;
      this.updateDrawings();
      player.updateRom();
    };

    document.getElementById("instrumentInitialVolume").oninput = (e) => {
      this.getSelectedInstrument().initial_volume = e.target.value;
      this.updateDrawings();
      player.updateRom();
    };
    document.getElementById("instrumentVolumeChange").oninput = (e) => {
      this.getSelectedInstrument().volume_sweep_change = e.target.value;
      this.updateDrawings();
      player.updateRom();
    };

    document.getElementById("instrumentSweepTime").onchange = (e) => {
      this.getSelectedInstrument().frequency_sweep_time =
        e.target.selectedIndex;
      this.updateDrawings();
      player.updateRom();
    };
    document.getElementById("instrumentSweepChange").oninput = (e) => {
      this.getSelectedInstrument().frequency_sweep_shift = e.target.value;
      this.updateDrawings();
      player.updateRom();
    };

    document.getElementById("instrumentDuty").onchange = (e) => {
      this.getSelectedInstrument().duty_cycle = e.target.selectedIndex;
      player.updateRom();
    };

    document.getElementById("instrumentWaveVolume").onchange = (e) => {
      this.getSelectedInstrument().volume = e.target.selectedIndex;
      player.updateRom();
    };
    document.getElementById("instrumentWaveIndex").onchange = (e) => {
      this.getSelectedInstrument().wave_index = e.target.selectedIndex;
      this.updateDrawings();
      player.updateRom();
    };
    document.getElementById("instrumentWaveCanvas").onmousemove = (e) => {
      if (e.buttons == 0) return;
      var x = e.offsetX / e.target.width;
      var y = 1.0 - e.offsetY / e.target.height;
      var value = Math.round(y * 15);
      var index = Math.round(x * 32);
      song.waves[this.getSelectedInstrument().wave_index][index] = value;
      this.updateDrawings();
      player.updateRom();
    };

    document.getElementById("instrumentNoiseShiftClockMask").oninput = (e) => {
      this.getSelectedInstrument().shift_clock_mask = e.target.value;
      player.updateRom();
    };
    document.getElementById("instrumentNoiseDividingRatio").oninput = (e) => {
      this.getSelectedInstrument().dividing_ratio = e.target.value;
      player.updateRom();
    };
    document.getElementById("instrumentNoise7bit").onchange = (e) => {
      this.getSelectedInstrument().bit_count = e.target.checked ? 7 : 15;
      player.updateRom();
    };
  }

  updateInstrumentList() {
    var select = document.getElementById("instrumentSelector");
    while (select.options.length > 0) select.options.remove(0);
    for (var idx = 0; idx < song.duty_instruments.length; idx++) {
      var i = song.duty_instruments[idx];
      var node = document.createElement("option");
      node.innerText = `${idx + 1}: ${i.name}`;
      node.value = idx;
      select.children[0].appendChild(node);
    }
    for (var idx = 0; idx < song.wave_instruments.length; idx++) {
      var i = song.wave_instruments[idx];
      var node = document.createElement("option");
      node.innerText = `${idx + 1}: ${i.name}`;
      node.value = idx;
      select.children[1].appendChild(node);
    }
    for (var idx = 0; idx < song.noise_instruments.length; idx++) {
      var i = song.noise_instruments[idx];
      var node = document.createElement("option");
      node.innerText = `${idx + 1}: ${i.name}`;
      node.value = idx;
      select.children[2].appendChild(node);
    }

    var select = document.getElementById("instrumentWaveIndex");
    while (select.options.length > 0) select.options.remove(0);
    for (var idx = 0; idx < song.waves.length; idx++) {
      var node = document.createElement("option");
      var name = `${idx + 1}`;
      for (var i = 0; i < song.wave_instruments.length; i++)
        if (song.wave_instruments[i].wave_index == idx)
          name += ` ${song.wave_instruments[i].name}`;
      node.innerText = name;
      node.value = idx;
      select.options.add(node);
    }

    this.showSelectedInstrument();
  }

  showSelectedInstrument() {
    var i = this.getSelectedInstrument();

    for (var row of document.getElementById("instruments").children[0]
      .children) {
      var t = row.getAttribute("type");
      if (t === null) continue;
      row.style.display = "";
      if (i instanceof DutyInstrument && t.indexOf("D") > -1) continue;
      if (i instanceof WaveInstrument && t.indexOf("W") > -1) continue;
      if (i instanceof NoiseInstrument && t.indexOf("N") > -1) continue;
      row.style.display = "none";
    }

    document.getElementById("instrumentName").value = i.name;

    document.getElementById("instrumentLength").max =
      i instanceof WaveInstrument ? 255 : 63;
    if (i.length === null) {
      document.getElementById("instrumentLengthEnabled").checked = false;
      document.getElementById("instrumentLength").value = 0;
    } else {
      document.getElementById("instrumentLengthEnabled").checked = true;
      document.getElementById("instrumentLength").value = i.length;
    }

    if (i instanceof DutyInstrument || i instanceof NoiseInstrument) {
      document.getElementById("instrumentInitialVolume").value =
        i.initial_volume;
      document.getElementById("instrumentVolumeChange").value =
        i.volume_sweep_change;
    }
    if (i instanceof DutyInstrument) {
      document.getElementById("instrumentSweepTime").selectedIndex =
        i.frequency_sweep_time;
      document.getElementById("instrumentSweepChange").value =
        i.frequency_sweep_shift;

      document.getElementById("instrumentDuty").selectedIndex = i.duty_cycle;
    } else if (i instanceof WaveInstrument) {
      document.getElementById("instrumentWaveVolume").selectedIndex = i.volume;
      document.getElementById("instrumentWaveIndex").selectedIndex =
        i.wave_index;
    } else if (i instanceof NoiseInstrument) {
      document.getElementById("instrumentNoiseShiftClockMask").value =
        i.shift_clock_mask;
      document.getElementById("instrumentNoiseDividingRatio").value =
        i.dividing_ratio;
      document.getElementById("instrumentNoise7bit").checked = i.bit_count == 7;
    }
    this.updateDrawings();
  }

  updateDrawings() {
    var i = this.getSelectedInstrument();

    if (i instanceof DutyInstrument || i instanceof NoiseInstrument) {
      var points = [];
      var value = i.initial_volume / 15.0;
      var change =
        i.volume_sweep_change == 0
          ? 0
          : Math.sign(i.volume_sweep_change) /
            (8 - Math.abs(i.volume_sweep_change)) /
            32;
      for (var n = 0; n < 128; n++) {
        points.push(value);
        value += change;
        if (i.length !== null && n > i.length) value = 0;
      }
      this.renderCanvas("instrumentVolumeCanvas", points);
    }

    if (i instanceof DutyInstrument) {
      var points = [];
      var value = 1024;
      for (var n = 0; n < 128; n++) {
        var diff = value >> Math.abs(i.frequency_sweep_shift);
        if (i.frequency_sweep_time > 0) {
          if (i.frequency_sweep_shift < 0)
            value -= diff / i.frequency_sweep_time;
          else value += diff / i.frequency_sweep_time;
        }
        points.push(value / 2048);
      }
      this.renderCanvas("instrumentSweepCanvas", points);
    }

    if (i instanceof WaveInstrument) {
      var points = [];
      for (var value of song.waves[i.wave_index]) points.push(value / 15);
      this.renderCanvas("instrumentWaveCanvas", points, [32, 15]);
    }
  }

  renderCanvas(id, points, grid_size) {
    var canvas = document.getElementById(id);
    var w = canvas.width;
    var h = canvas.height - 6;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, w, h + 6);

    if (grid_size) {
      ctx.beginPath();
      ctx.strokeStyle = "#eeeeee";
      ctx.lineWidth = 1;
      for (var x = 0; x < grid_size[0]; x++) {
        ctx.moveTo((w / grid_size[0]) * x, 0);
        ctx.lineTo((w / grid_size[0]) * x, h + 6);
      }
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = "#3030ee";
    ctx.lineWidth = 3;
    ctx.moveTo(0, 3 + h - Math.max(0.0, Math.min(1.0, points[0])) * h);
    for (var idx = 1; idx < points.length; idx++) {
      ctx.lineTo(
        (w * idx) / (points.length - 1),
        3 + h - Math.max(0.0, Math.min(1.0, points[idx])) * h,
      );
    }
    ctx.stroke();
  }

  getSelectedInstrument() {
    var select = document.getElementById("instrumentSelector");
    var option = select.selectedOptions[0];
    if (option.parentElement.label == "Duty")
      return song.duty_instruments[option.value];
    if (option.parentElement.label == "Wave")
      return song.wave_instruments[option.value];
    if (option.parentElement.label == "Noise")
      return song.noise_instruments[option.value];
    return null;
  }
}
