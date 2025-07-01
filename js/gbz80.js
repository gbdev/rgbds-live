const gameboy_hardware_constants = {
  // Memory-mapped registers ($FFxx range)
  rJOYP: {
    value: "$FF00",
    alias: "rP1",
    description: "Joypad face buttons",
    flags: {
      B_JOYP_GET_BUTTONS: {
        description: "0 = reading buttons [r/w]",
        value: "5"
      },
      B_JOYP_GET_CTRL_PAD: {
        description: "0 = reading Control Pad [r/w]",
        value: "4"
      },
      JOYP_GET: {
        description: "select which inputs to read from the lower nybble",
        value: "%00_11_0000"
      },
      JOYP_GET_BUTTONS: {
        description: "reading A/B/Select/Start buttons",
        value: "%00_01_0000"
      },
      JOYP_GET_CTRL_PAD: {
        description: "reading Control Pad directions",
        value: "%00_10_0000"
      },
      JOYP_GET_NONE: {
        description: "reading nothing",
        value: "%00_11_0000"
      },
      B_JOYP_START: {
        description: "0 = Start is pressed (if reading buttons) [ro]",
        value: "3"
      },
      B_JOYP_SELECT: {
        description: "0 = Select is pressed (if reading buttons) [ro]",
        value: "2"
      },
      B_JOYP_B: {
        description: "0 = B is pressed (if reading buttons) [ro]",
        value: "1"
      },
      B_JOYP_A: {
        description: "0 = A is pressed (if reading buttons) [ro]",
        value: "0"
      },
      B_JOYP_DOWN: {
        description: "0 = Down is pressed (if reading Control Pad) [ro]",
        value: "3"
      },
      B_JOYP_UP: {
        description: "0 = Up is pressed (if reading Control Pad) [ro]",
        value: "2"
      },
      B_JOYP_LEFT: {
        description: "0 = Left is pressed (if reading Control Pad) [ro]",
        value: "1"
      },
      B_JOYP_RIGHT: {
        description: "0 = Right is pressed (if reading Control Pad) [ro]",
        value: "0"
      },
      JOYP_INPUTS: {
        description: "",
        value: "%0000_1111"
      },
      JOYP_START: {
        description: "Start is pressed (if reading buttons)",
        value: "%00001000"
      },
      JOYP_SELECT: {
        description: "Select is pressed (if reading buttons)",
        value: "%00000100"
      },
      JOYP_B: {
        description: "B is pressed (if reading buttons)",
        value: "%00000010"
      },
      JOYP_A: {
        description: "A is pressed (if reading buttons)",
        value: "%00000001"
      },
      JOYP_DOWN: {
        description: "Down is pressed (if reading Control Pad)",
        value: "%00001000"
      },
      JOYP_UP: {
        description: "Up is pressed (if reading Control Pad)",
        value: "%00000100"
      },
      JOYP_LEFT: {
        description: "Left is pressed (if reading Control Pad)",
        value: "%00000010"
      },
      JOYP_RIGHT: {
        description: "Right is pressed (if reading Control Pad)",
        value: "%00000001"
      }
    }
  },
  rSB: {
    value: "$FF01",
    description: "Serial transfer data [r/w]"
  },
  rSC: {
    value: "$FF02",
    description: "Serial transfer control",
    flags: {
      B_SC_START: {
        description: "reading 1 = transfer in progress, writing 1 = start transfer [r/w]",
        value: "7"
      },
      B_SC_SPEED: {
        description: "(CGB only) 1 = use faster internal clock [r/w]",
        value: "1"
      },
      B_SC_SOURCE: {
        description: "0 = use external clock (\"slave\"), 1 = use internal clock (\"master\") [r/w]",
        value: "0"
      },
      SC_START: {
        description: "reading 1 = transfer in progress, writing 1 = start transfer [r/w]",
        value: "%10000000"
      },
      SC_SPEED: {
        description: "(CGB only) 1 = use faster internal clock [r/w]",
        value: "%00000010"
      },
      SC_SLOW: {
        description: "use slower internal clock",
        value: "%00000000"
      },
      SC_FAST: {
        description: "use faster internal clock",
        value: "%00000010"
      },
      SC_SOURCE: {
        description: "0 = use external clock (\"slave\"), 1 = use internal clock (\"master\") [r/w]",
        value: "%00000001"
      },
      SC_EXTERNAL: {
        description: "use external clock (\"slave\")",
        value: "%00000000"
      },
      SC_INTERNAL: {
        description: "use internal clock (\"master\")",
        value: "%00000001"
      }
    }
  },
  rDIV: {
    value: "$FF04",
    description: "Divider register [r/w]"
  },
  rTIMA: {
    value: "$FF05",
    description: "Timer counter [r/w]"
  },
  rTMA: {
    value: "$FF06",
    description: "Timer modulo [r/w]"
  },
  rTAC: {
    value: "$FF07",
    description: "Timer control",
    flags: {
      B_TAC_START: {
        description: "enable incrementing TIMA [r/w]",
        value: "2"
      },
      TAC_STOP: {
        description: "disable incrementing TIMA",
        value: "%00000000"
      },
      TAC_START: {
        description: "enable incrementing TIMA",
        value: "%00000100"
      },
      TAC_CLOCK: {
        description: "the frequency at which TIMA increments [r/w]",
        value: "%000000_11"
      },
      TAC_4KHZ: {
        description: "every 256 M-cycles = ~4 KHz on DMG",
        value: "%000000_00"
      },
      TAC_262KHZ: {
        description: "every 4 M-cycles = ~262 KHz on DMG",
        value: "%000000_01"
      },
      TAC_65KHZ: {
        description: "every 16 M-cycles = ~65 KHz on DMG",
        value: "%000000_10"
      },
      TAC_16KHZ: {
        description: "every 64 M-cycles = ~16 KHz on DMG",
        value: "%000000_11"
      }
    }
  },
  rIF: {
    value: "$FF0F",
    description: "Pending interrupts",
    flags: {
      B_IF_JOYPAD: {
        description: "1 = joypad interrupt is pending [r/w]",
        value: "4"
      },
      B_IF_SERIAL: {
        description: "1 = serial interrupt is pending [r/w]",
        value: "3"
      },
      B_IF_TIMER: {
        description: "1 = timer interrupt is pending [r/w]",
        value: "2"
      },
      B_IF_STAT: {
        description: "1 = STAT interrupt is pending [r/w]",
        value: "1"
      },
      B_IF_VBLANK: {
        description: "1 = VBlank interrupt is pending [r/w]",
        value: "0"
      },
      IF_JOYPAD: {
        description: "1 = joypad interrupt is pending [r/w]",
        value: "%00010000"
      },
      IF_SERIAL: {
        description: "1 = serial interrupt is pending [r/w]",
        value: "%00001000"
      },
      IF_TIMER: {
        description: "1 = timer interrupt is pending [r/w]",
        value: "%00000100"
      },
      IF_STAT: {
        description: "1 = STAT interrupt is pending [r/w]",
        value: "%00000010"
      },
      IF_VBLANK: {
        description: "1 = VBlank interrupt is pending [r/w]",
        value: "%00000001"
      }
    }
  },
  rAUD1SWEEP: {
    value: "$FF10",
    alias: "rNR10",
    description: "Audio channel 1 sweep",
    flags: {
      AUD1SWEEP_TIME: {
        description: "how long between sweep iterations (in 128 Hz ticks, ~7.8 ms apart) [r/w]",
        value: "%0_111_0000"
      },
      B_AUD1SWEEP_DIR: {
        description: "sweep direction [r/w]",
        value: "3"
      },
      AUD1SWEEP_DIR: {
        description: "sweep direction [r/w]",
        value: "%00001000"
      },
      AUD1SWEEP_UP: {
        description: "sweep up",
        value: "%00000000"
      },
      AUD1SWEEP_DOWN: {
        description: "sweep down",
        value: "%00001000"
      },
      AUD1SWEEP_SHIFT: {
        description: "how much the period increases/decreases per iteration [r/w]",
        value: "%00000_111"
      }
    }
  },
  rAUD1LEN: {
    value: "$FF11",
    alias: "rNR11",
    description: "Audio channel 1 length timer and duty cycle",
    flags: {
      AUD1LEN_DUTY: {
        description: "ratio of time spent high vs. time spent low [r/w]",
        value: "%11_000000"
      },
      AUD1LEN_DUTY_12_5: {
        description: "12.5%",
        value: "%00_000000"
      },
      AUD1LEN_DUTY_25: {
        description: "25%",
        value: "%01_000000"
      },
      AUD1LEN_DUTY_50: {
        description: "50%",
        value: "%10_000000"
      },
      AUD1LEN_DUTY_75: {
        description: "75%",
        value: "%11_000000"
      },
      AUD1LEN_TIMER: {
        description: "initial length timer (0-63) [wo]",
        value: "%00_111111"
      }
    }
  },
  rAUD1ENV: {
    value: "$FF12",
    alias: "rNR12",
    description: "Audio channel 1 volume and envelope",
    flags: {
      AUD1ENV_INIT_VOLUME: {
        description: "initial volume [r/w]",
        value: "%1111_0000"
      },
      B_AUD1ENV_DIR: {
        description: "direction of volume envelope [r/w]",
        value: "3"
      },
      AUD1ENV_DIR: {
        description: "direction of volume envelope [r/w]",
        value: "%00001000"
      },
      AUD1ENV_DOWN: {
        description: "volume envelope down",
        value: "%00000000"
      },
      AUD1ENV_UP: {
        description: "volume envelope up",
        value: "%00001000"
      },
      AUD1ENV_PACE: {
        description: "how long between envelope iterations (in 64 Hz ticks, ~15.6 ms apart) [r/w]",
        value: "%00000_111"
      }
    }
  },
  rAUD1LOW: {
    value: "$FF13",
    alias: "rNR13",
    description: "Audio channel 1 period (low 8 bits) [r/w]"
  },
  rAUD1HIGH: {
    value: "$FF14",
    alias: "rNR14",
    description: "Audio channel 1 period (high 3 bits) and control",
    flags: {
      B_AUD1HIGH_RESTART: {
        description: "1 = restart the channel [wo]",
        value: "7"
      },
      B_AUD1HIGH_LEN_ENABLE: {
        description: "1 = reset the channel after the length timer expires [r/w]",
        value: "6"
      },
      AUD1HIGH_RESTART: {
        description: "restart the channel",
        value: "%10000000"
      },
      AUD1HIGH_LENGTH_OFF: {
        description: "",
        value: "%00000000"
      },
      AUD1HIGH_LENGTH_ON: {
        description: "reset the channel after the length timer expires",
        value: "%01000000"
      },
      AUD1HIGH_PERIOD_HIGH: {
        description: "upper 3 bits of the channel's period [r/w]",
        value: "%00000_111"
      }
    }
  },
  rAUD2LEN: {
    value: "$FF16",
    alias: "rNR21",
    description: "Audio channel 2 length timer and duty cycle",
    flags: {
      AUD2LEN_DUTY: {
        description: "ratio of time spent high vs. time spent low [r/w]",
        value: "%11_000000"
      },
      AUD2LEN_DUTY_12_5: {
        description: "12.5%",
        value: "%00_000000"
      },
      AUD2LEN_DUTY_25: {
        description: "25%",
        value: "%01_000000"
      },
      AUD2LEN_DUTY_50: {
        description: "50%",
        value: "%10_000000"
      },
      AUD2LEN_DUTY_75: {
        description: "75%",
        value: "%11_000000"
      },
      AUD2LEN_TIMER: {
        description: "initial length timer (0-63) [wo]",
        value: "%00_111111"
      }
    }
  },
  rAUD2ENV: {
    value: "$FF17",
    alias: "rNR22",
    description: "Audio channel 2 volume and envelope",
    flags: {
      AUD2ENV_INIT_VOLUME: {
        description: "initial volume [r/w]",
        value: "%1111_0000"
      },
      B_AUD2ENV_DIR: {
        description: "direction of volume envelope [r/w]",
        value: "3"
      },
      AUD2ENV_DIR: {
        description: "direction of volume envelope [r/w]",
        value: "%00001000"
      },
      AUD2ENV_DOWN: {
        description: "volume envelope down",
        value: "%00000000"
      },
      AUD2ENV_UP: {
        description: "volume envelope up",
        value: "%00001000"
      },
      AUD2ENV_PACE: {
        description: "how long between envelope iterations (in 64 Hz ticks, ~15.6 ms apart) [r/w]",
        value: "%00000_111"
      }
    }
  },
  rAUD2LOW: {
    value: "$FF18",
    alias: "rNR23",
    description: "Audio channel 2 period (low 8 bits) [r/w]"
  },
  rAUD2HIGH: {
    value: "$FF19",
    alias: "rNR24",
    description: "Audio channel 2 period (high 3 bits) and control",
    flags: {
      B_AUD2HIGH_RESTART: {
        description: "1 = restart the channel [wo]",
        value: "7"
      },
      B_AUD2HIGH_LEN_ENABLE: {
        description: "1 = reset the channel after the length timer expires [r/w]",
        value: "6"
      },
      AUD2HIGH_RESTART: {
        description: "1 = restart the channel [wo]",
        value: "%10000000"
      },
      AUD2HIGH_LENGTH_OFF: {
        description: "",
        value: "%00000000"
      },
      AUD2HIGH_LENGTH_ON: {
        description: "reset the channel after the length timer expires",
        value: "%01000000"
      },
      AUD2HIGH_PERIOD_HIGH: {
        description: "upper 3 bits of the channel's period [r/w]",
        value: "%00000_111"
      }
    }
  },
  rAUD3ENA: {
    value: "$FF1A",
    alias: "rNR30",
    description: "Audio channel 3 enable",
    flags: {
      B_AUD3ENA_ENABLE: {
        description: "1 = channel is active [r/w]",
        value: "7"
      },
      AUD3ENA_OFF: {
        description: "channel is inactive",
        value: "%00000000"
      },
      AUD3ENA_ON: {
        description: "channel is active",
        value: "%10000000"
      }
    }
  },
  rAUD3LEN: {
    value: "$FF1B",
    alias: "rNR31",
    description: "Audio channel 3 length timer [wo]"
  },
  rAUD3LEVEL: {
    value: "$FF1C",
    alias: "rNR32",
    description: "Audio channel 3 volume",
    flags: {
      AUD3LEVEL_VOLUME: {
        description: "volume level [r/w]",
        value: "%0_11_00000"
      },
      AUD3LEVEL_MUTE: {
        description: "0% (muted)",
        value: "%0_00_00000"
      },
      AUD3LEVEL_100: {
        description: "100%",
        value: "%0_01_00000"
      },
      AUD3LEVEL_50: {
        description: "50%",
        value: "%0_10_00000"
      },
      AUD3LEVEL_25: {
        description: "25%",
        value: "%0_11_00000"
      }
    }
  },
  rAUD3LOW: {
    value: "$FF1D",
    alias: "rNR33",
    description: "Audio channel 3 period (low 8 bits) [r/w]"
  },
  rAUD3HIGH: {
    value: "$FF1E",
    alias: "rNR34",
    description: "Audio channel 3 period (high 3 bits) and control",
    flags: {
      B_AUD3HIGH_RESTART: {
        description: "1 = restart the channel [wo]",
        value: "7"
      },
      B_AUD3HIGH_LEN_ENABLE: {
        description: "1 = reset the channel after the length timer expires [r/w]",
        value: "6"
      },
      AUD3HIGH_RESTART: {
        description: "1 = restart the channel [wo]",
        value: "%10000000"
      },
      AUD3HIGH_LENGTH_OFF: {
        description: "",
        value: "%00000000"
      },
      AUD3HIGH_LENGTH_ON: {
        description: "reset the channel after the length timer expires",
        value: "%01000000"
      },
      AUD3HIGH_PERIOD_HIGH: {
        description: "upper 3 bits of the channel's period [r/w]",
        value: "%00000_111"
      }
    }
  },
  rAUD4LEN: {
    value: "$FF20",
    alias: "rNR41",
    description: "Audio channel 4 length timer",
    flags: {
      AUD4LEN_TIMER: {
        description: "initial length timer (0-63) [wo]",
        value: "%00_111111"
      }
    }
  },
  rAUD4ENV: {
    value: "$FF21",
    alias: "rNR42",
    description: "Audio channel 4 volume and envelope",
    flags: {
      AUD4ENV_INIT_VOLUME: {
        description: "initial volume [r/w]",
        value: "%1111_0000"
      },
      B_AUD4ENV_DIR: {
        description: "direction of volume envelope [r/w]",
        value: "3"
      },
      AUD4ENV_DIR: {
        description: "direction of volume envelope [r/w]",
        value: "%00001000"
      },
      AUD4ENV_DOWN: {
        description: "volume envelope down",
        value: "%00000000"
      },
      AUD4ENV_UP: {
        description: "volume envelope up",
        value: "%00001000"
      },
      AUD4ENV_PACE: {
        description: "how long between envelope iterations (in 64 Hz ticks, ~15.6 ms apart) [r/w]",
        value: "%00000_111"
      }
    }
  },
  rAUD4POLY: {
    value: "$FF22",
    alias: "rNR43",
    description: "Audio channel 4 period and randomness",
    flags: {
      AUD4POLY_SHIFT: {
        description: "coarse control of the channel's period [r/w]",
        value: "%1111_0000"
      },
      B_AUD4POLY_WIDTH: {
        description: "controls the noise generator (LFSR)'s step width [r/w]",
        value: "3"
      },
      AUD4POLY_15STEP: {
        description: "15-bit step width",
        value: "%00000000"
      },
      AUD4POLY_7STEP: {
        description: "7-bit step width",
        value: "%00001000"
      },
      AUD4POLY_DIV: {
        description: "fine control of the channel's period [r/w]",
        value: "%00000_111"
      }
    }
  },
  rAUD4GO: {
    value: "$FF23",
    alias: "rNR44",
    description: "Audio channel 4 control",
    flags: {
      B_AUD4GO_RESTART: {
        description: "1 = restart the channel [wo]",
        value: "7"
      },
      B_AUD4GO_LEN_ENABLE: {
        description: "1 = reset the channel after the length timer expires [r/w]",
        value: "6"
      },
      AUD4GO_RESTART: {
        description: "1 = restart the channel [wo]",
        value: "%10000000"
      },
      AUD4GO_LENGTH_OFF: {
        description: "",
        value: "%00000000"
      },
      AUD4GO_LENGTH_ON: {
        description: "reset the channel after the length timer expires",
        value: "%01000000"
      }
    }
  },
  rAUDVOL: {
    value: "$FF24",
    alias: "rNR50",
    description: "Audio master volume and VIN mixer",
    flags: {
      B_AUDVOL_VIN_LEFT: {
        description: "1 = output VIN to left ear (SO2, speaker 2) [r/w]",
        value: "7"
      },
      AUDVOL_VIN_LEFT: {
        description: "1 = output VIN to left ear (SO2, speaker 2) [r/w]",
        value: "%10000000"
      },
      AUDVOL_LEFT: {
        description: "0 = barely audible, 7 = full volume [r/w]",
        value: "%0_111_0000"
      },
      B_AUDVOL_VIN_RIGHT: {
        description: "1 = output VIN to right ear (SO1, speaker 1) [r/w]",
        value: "3"
      },
      AUDVOL_VIN_RIGHT: {
        description: "1 = output VIN to right ear (SO1, speaker 1) [r/w]",
        value: "%00001000"
      },
      AUDVOL_RIGHT: {
        description: "0 = barely audible, 7 = full volume [r/w]",
        value: "%00000_111"
      }
    }
  },
  rAUDTERM: {
    value: "$FF25",
    alias: "rNR51",
    description: "Audio channel mixer",
    flags: {
      B_AUDTERM_4_LEFT: {
        description: "1 = output channel 4 to left ear [r/w]",
        value: "7"
      },
      B_AUDTERM_3_LEFT: {
        description: "1 = output channel 3 to left ear [r/w]",
        value: "6"
      },
      B_AUDTERM_2_LEFT: {
        description: "1 = output channel 2 to left ear [r/w]",
        value: "5"
      },
      B_AUDTERM_1_LEFT: {
        description: "1 = output channel 1 to left ear [r/w]",
        value: "4"
      },
      B_AUDTERM_4_RIGHT: {
        description: "1 = output channel 4 to right ear [r/w]",
        value: "3"
      },
      B_AUDTERM_3_RIGHT: {
        description: "1 = output channel 3 to right ear [r/w]",
        value: "2"
      },
      B_AUDTERM_2_RIGHT: {
        description: "1 = output channel 2 to right ear [r/w]",
        value: "1"
      },
      B_AUDTERM_1_RIGHT: {
        description: "1 = output channel 1 to right ear [r/w]",
        value: "0"
      },
      AUDTERM_4_LEFT: {
        description: "1 = output channel 4 to left ear [r/w]",
        value: "%10000000"
      },
      AUDTERM_3_LEFT: {
        description: "1 = output channel 3 to left ear [r/w]",
        value: "%01000000"
      },
      AUDTERM_2_LEFT: {
        description: "1 = output channel 2 to left ear [r/w]",
        value: "%00100000"
      },
      AUDTERM_1_LEFT: {
        description: "1 = output channel 1 to left ear [r/w]",
        value: "%00010000"
      },
      AUDTERM_4_RIGHT: {
        description: "1 = output channel 4 to right ear [r/w]",
        value: "%00001000"
      },
      AUDTERM_3_RIGHT: {
        description: "1 = output channel 3 to right ear [r/w]",
        value: "%00000100"
      },
      AUDTERM_2_RIGHT: {
        description: "1 = output channel 2 to right ear [r/w]",
        value: "%00000010"
      },
      AUDTERM_1_RIGHT: {
        description: "1 = output channel 1 to right ear [r/w]",
        value: "%00000001"
      }
    }
  },
  rAUDENA: {
    value: "$FF26",
    alias: "rNR52",
    description: "Audio master enable",
    flags: {
      B_AUDENA_ENABLE: {
        description: "0 = disable the APU (resets all audio registers to 0!) [r/w]",
        value: "7"
      },
      B_AUDENA_ENABLE_CH4: {
        description: "1 = channel 4 is running [ro]",
        value: "3"
      },
      B_AUDENA_ENABLE_CH3: {
        description: "1 = channel 3 is running [ro]",
        value: "2"
      },
      B_AUDENA_ENABLE_CH2: {
        description: "1 = channel 2 is running [ro]",
        value: "1"
      },
      B_AUDENA_ENABLE_CH1: {
        description: "1 = channel 1 is running [ro]",
        value: "0"
      },
      AUDENA_OFF: {
        description: "disable the APU (resets all audio registers to 0!)",
        value: "%00000000"
      },
      AUDENA_ON: {
        description: "enable the APU",
        value: "%10000000"
      },
      AUDENA_CH4_OFF: {
        description: "channel 4 is not running",
        value: "%00000000"
      },
      AUDENA_CH4_ON: {
        description: "channel 4 is running",
        value: "%00001000"
      },
      AUDENA_CH3_OFF: {
        description: "channel 3 is not running",
        value: "%00000000"
      },
      AUDENA_CH3_ON: {
        description: "channel 3 is running",
        value: "%00000100"
      },
      AUDENA_CH2_OFF: {
        description: "channel 2 is not running",
        value: "%00000000"
      },
      AUDENA_CH2_ON: {
        description: "channel 2 is running",
        value: "%00000010"
      },
      AUDENA_CH1_OFF: {
        description: "channel 1 is not running",
        value: "%00000000"
      },
      AUDENA_CH1_ON: {
        description: "channel 1 is running",
        value: "%00000001"
      }
    }
  },
  _AUD3WAVERAM: {
    value: "$FF30",
    description: "Audio channel 3 wave pattern RAM [r/w]",
    flags: {
      rAUD3WAVE_0: {
        description: "",
        value: "$FF30"
      },
      rAUD3WAVE_1: {
        description: "",
        value: "$FF31"
      },
      rAUD3WAVE_2: {
        description: "",
        value: "$FF32"
      },
      rAUD3WAVE_3: {
        description: "",
        value: "$FF33"
      },
      rAUD3WAVE_4: {
        description: "",
        value: "$FF34"
      },
      rAUD3WAVE_5: {
        description: "",
        value: "$FF35"
      },
      rAUD3WAVE_6: {
        description: "",
        value: "$FF36"
      },
      rAUD3WAVE_7: {
        description: "",
        value: "$FF37"
      },
      rAUD3WAVE_8: {
        description: "",
        value: "$FF38"
      },
      rAUD3WAVE_9: {
        description: "",
        value: "$FF39"
      },
      rAUD3WAVE_A: {
        description: "",
        value: "$FF3A"
      },
      rAUD3WAVE_B: {
        description: "",
        value: "$FF3B"
      },
      rAUD3WAVE_C: {
        description: "",
        value: "$FF3C"
      },
      rAUD3WAVE_D: {
        description: "",
        value: "$FF3D"
      },
      rAUD3WAVE_E: {
        description: "",
        value: "$FF3E"
      },
      rAUD3WAVE_F: {
        description: "",
        value: "$FF3F"
      },
      AUD3WAVE_SIZE: {
        description: "",
        value: "16"
      }
    }
  },
  rLCDC: {
    value: "$FF40",
    description: "PPU graphics control",
    flags: {
      B_LCDC_ENABLE: {
        description: "whether the PPU (and LCD) are turned on [r/w]",
        value: "7"
      },
      B_LCDC_WIN_MAP: {
        description: "which tilemap the Window reads from [r/w]",
        value: "6"
      },
      B_LCDC_WINDOW: {
        description: "whether the Window is enabled [r/w]",
        value: "5"
      },
      B_LCDC_BLOCKS: {
        description: "which \"tile blocks\" the BG and Window use [r/w]",
        value: "4"
      },
      B_LCDC_BG_MAP: {
        description: "which tilemap the BG reads from [r/w]",
        value: "3"
      },
      B_LCDC_OBJ_SIZE: {
        description: "how many pixels tall each OBJ is [r/w]",
        value: "2"
      },
      B_LCDC_OBJS: {
        description: "whether OBJs are enabled [r/w]",
        value: "1"
      },
      B_LCDC_BG: {
        description: "(DMG only) whether the BG is enabled [r/w]",
        value: "0"
      },
      B_LCDC_PRIO: {
        description: "(CGB only) whether OBJ priority bits are enabled [r/w]",
        value: "0"
      },
      LCDC_ENABLE: {
        description: "whether the PPU (and LCD) are turned on [r/w]",
        value: "%10000000"
      },
      LCDC_OFF: {
        description: "the PPU (and LCD) are turned off",
        value: "%00000000"
      },
      LCDC_ON: {
        description: "the PPU (and LCD) are turned on",
        value: "%10000000"
      },
      LCDC_WIN_MAP: {
        description: "which tilemap the Window reads from [r/w]",
        value: "%01000000"
      },
      LCDC_WIN_9800: {
        description: "the Window reads from TILEMAP0 ($9800)",
        value: "%00000000"
      },
      LCDC_WIN_9C00: {
        description: "the Window reads from TILEMAP1 ($9C00)",
        value: "%01000000"
      },
      LCDC_WINDOW: {
        description: "whether the Window is enabled [r/w]",
        value: "%00100000"
      },
      LCDC_WIN_OFF: {
        description: "the Window is disabled",
        value: "%00000000"
      },
      LCDC_WIN_ON: {
        description: "the Window is enabled",
        value: "%00100000"
      },
      LCDC_BLOCKS: {
        description: "which \"tile blocks\" the BG and Window use [r/w]",
        value: "%00010000"
      },
      LCDC_BLOCK21: {
        description: "the BG and Window use \"tile blocks\" 2 and 1",
        value: "%00000000"
      },
      LCDC_BLOCK01: {
        description: "the BG and Window use \"tile blocks\" 0 and 1",
        value: "%00010000"
      },
      LCDC_BG_MAP: {
        description: "which tilemap the BG reads from [r/w]",
        value: "%00001000"
      },
      LCDC_BG_9800: {
        description: "the BG reads from TILEMAP0 ($9800)",
        value: "%00000000"
      },
      LCDC_BG_9C00: {
        description: "the BG reads from TILEMAP1 ($9C00)",
        value: "%00001000"
      },
      LCDC_OBJ_SIZE: {
        description: "how many pixels tall each OBJ is [r/w]",
        value: "%00000100"
      },
      LCDC_OBJ_8: {
        description: "each OBJ is 8 pixels tall",
        value: "%00000000"
      },
      LCDC_OBJ_16: {
        description: "each OBJ is 16 pixels tall",
        value: "%00000100"
      },
      LCDC_OBJS: {
        description: "whether OBJs are enabled [r/w]",
        value: "%00000010"
      },
      LCDC_OBJ_OFF: {
        description: "OBJs are disabled",
        value: "%00000000"
      },
      LCDC_OBJ_ON: {
        description: "OBJs are enabled",
        value: "%00000010"
      },
      LCDC_BG: {
        description: "(DMG only) whether the BG is enabled [r/w]",
        value: "%00000001"
      },
      LCDC_BG_OFF: {
        description: "the BG is disabled",
        value: "%00000000"
      },
      LCDC_BG_ON: {
        description: "the BG is enabled",
        value: "%00000001"
      },
      LCDC_PRIO: {
        description: "(CGB only) whether OBJ priority bits are enabled [r/w]",
        value: "%00000001"
      },
      LCDC_PRIO_OFF: {
        description: "OBJ priority bits are disabled",
        value: "%00000000"
      },
      LCDC_PRIO_ON: {
        description: "OBJ priority bits are enabled",
        value: "%00000001"
      }
    }
  },
  rSTAT: {
    value: "$FF41",
    description: "Graphics status and interrupt control",
    flags: {
      B_STAT_LYC: {
        description: "1 = LY match triggers the STAT interrupt [r/w]",
        value: "6"
      },
      B_STAT_MODE_2: {
        description: "1 = OAM Scan triggers the PPU interrupt [r/w]",
        value: "5"
      },
      B_STAT_MODE_1: {
        description: "1 = VBlank triggers the PPU interrupt [r/w]",
        value: "4"
      },
      B_STAT_MODE_0: {
        description: "1 = HBlank triggers the PPU interrupt [r/w]",
        value: "3"
      },
      B_STAT_LYCF: {
        description: "1 = LY is currently equal to LYC [ro]",
        value: "2"
      },
      B_STAT_BUSY: {
        description: "1 = the PPU is currently accessing VRAM [ro]",
        value: "1"
      },
      STAT_LYC: {
        description: "1 = LY match triggers the STAT interrupt [r/w]",
        value: "%01000000"
      },
      STAT_MODE_2: {
        description: "1 = OAM Scan triggers the PPU interrupt [r/w]",
        value: "%00100000"
      },
      STAT_MODE_1: {
        description: "1 = VBlank triggers the PPU interrupt [r/w]",
        value: "%00010000"
      },
      STAT_MODE_0: {
        description: "1 = HBlank triggers the PPU interrupt [r/w]",
        value: "%00001000"
      },
      STAT_LYCF: {
        description: "1 = LY is currently equal to LYC [ro]",
        value: "%00000100"
      },
      STAT_BUSY: {
        description: "1 = the PPU is currently accessing VRAM [ro]",
        value: "%00000010"
      },
      STAT_MODE: {
        description: "PPU's current status [ro]",
        value: "%000000_11"
      },
      STAT_HBLANK: {
        description: "waiting after a line's rendering (HBlank)",
        value: "%000000_00"
      },
      STAT_VBLANK: {
        description: "waiting between frames (VBlank)",
        value: "%000000_01"
      },
      STAT_OAM: {
        description: "checking which OBJs will be rendered on this line (OAM scan)",
        value: "%000000_10"
      },
      STAT_LCD: {
        description: "pushing pixels to the LCD",
        value: "%000000_11"
      }
    }
  },
  rSCY: {
    value: "$FF42",
    description: "Background Y scroll offset (in pixels) [r/w]"
  },
  rSCX: {
    value: "$FF43",
    description: "Background X scroll offset (in pixels) [r/w]"
  },
  rLY: {
    value: "$FF44",
    description: "Y coordinate of the line currently processed by the PPU (0-153) [ro]",
    flags: {
      LY_VBLANK: {
        description: "144-153 is the VBlank period",
        value: "144"
      }
    }
  },
  rLYC: {
    value: "$FF45",
    description: "Value that LY is constantly compared to [r/w]"
  },
  rDMA: {
    value: "$FF46",
    description: "OAM DMA start address (high 8 bits) and start [wo]"
  },
  rBGP: {
    value: "$FF47",
    description: "(DMG only) Background color mapping [r/w]",
    flags: {
      BGP_SGB_TRANSFER: {
        description: "set BGP to this value before SGB VRAM transfer",
        value: "%11_10_01_00"
      }
    }
  },
  rOBP0: {
    value: "$FF48",
    description: "(DMG only) OBJ color mapping #0 [r/w]"
  },
  rOBP1: {
    value: "$FF49",
    description: "(DMG only) OBJ color mapping #1 [r/w]"
  },
  rWY: {
    value: "$FF4A",
    description: "Y coordinate of the Window's top-left pixel (0-143) [r/w]"
  },
  rWX: {
    value: "$FF4B",
    description: "X coordinate of the Window's top-left pixel, plus 7 (7-166) [r/w]",
    flags: {
      WX_OFS: {
        description: "subtract this to get the actual Window Y coordinate",
        value: "7"
      }
    }
  },
  rSYS: {
    value: "$FF4C",
    alias: "rKEY0",
    description: "(CGB boot ROM only) CPU mode select",
    flags: {
      SYS_MODE: {
        description: "current system mode [r/w]",
        value: "%0000_11_00"
      },
      SYS_CGB: {
        description: "CGB mode",
        value: "%0000_00_00"
      },
      SYS_DMG: {
        description: "DMG compatibility mode",
        value: "%0000_01_00"
      },
      SYS_PGB1: {
        description: "LCD is driven externally, CPU is stopped",
        value: "%0000_10_00"
      },
      SYS_PGB2: {
        description: "LCD is driven externally, CPU is running",
        value: "%0000_11_00"
      }
    }
  },
  rSPD: {
    value: "$FF4D",
    alias: "rKEY1",
    description: "(CGB only) Double-speed mode control",
    flags: {
      B_SPD_DOUBLE: {
        description: "current clock speed [ro]",
        value: "7"
      },
      B_SPD_PREPARE: {
        description: "1 = next `stop` instruction will switch clock speeds [r/w]",
        value: "0"
      },
      SPD_SINGLE: {
        description: "single-speed clock",
        value: "%00000000"
      },
      SPD_DOUBLE: {
        description: "double-speed clock",
        value: "%10000000"
      },
      SPD_PREPARE: {
        description: "1 = next `stop` instruction will switch clock speeds [r/w]",
        value: "%00000001"
      }
    }
  },
  rVBK: {
    value: "$FF4F",
    description: "(CGB only) VRAM bank number (0 or 1)",
    flags: {
      VBK_BANK: {
        description: "mapped VRAM bank [r/w]",
        value: "%0000000_1"
      }
    }
  },
  rBANK: {
    value: "$FF50",
    description: "(boot ROM only) Boot ROM mapping control",
    flags: {
      B_BANK_ON: {
        description: "whether the boot ROM is mapped [wo]",
        value: "0"
      },
      BANK_ON: {
        description: "the boot ROM is mapped",
        value: "%00000000"
      },
      BANK_OFF: {
        description: "the boot ROM is not mapped",
        value: "%00000001"
      }
    }
  },
  rVDMA_SRC_HIGH: {
    value: "$FF51",
    alias: "rHDMA1",
    description: "(CGB only) VRAM DMA source address (high 8 bits) [wo]"
  },
  rVDMA_SRC_LOW: {
    value: "$FF52",
    alias: "rHDMA2",
    description: "(CGB only) VRAM DMA source address (low 8 bits) [wo]"
  },
  rVDMA_DEST_HIGH: {
    value: "$FF53",
    alias: "rHDMA3",
    description: "(CGB only) VRAM DMA destination address (high 8 bits) [wo]"
  },
  rVDMA_DEST_LOW: {
    value: "$FF54",
    alias: "rHDMA4",
    description: "(CGB only) VRAM DMA destination address (low 8 bits) [wo]"
  },
  rVDMA_LEN: {
    value: "$FF55",
    alias: "rHDMA5",
    description: "(CGB only) VRAM DMA length, mode, and start",
    flags: {
      B_VDMA_LEN_MODE: {
        description: "on write: VRAM DMA mode [wo]",
        value: "7"
      },
      VDMA_LEN_MODE: {
        description: "on write: VRAM DMA mode [wo]",
        value: "%10000000"
      },
      VDMA_LEN_MODE_GENERAL: {
        description: "GDMA (general-purpose)",
        value: "%00000000"
      },
      VDMA_LEN_MODE_HBLANK: {
        description: "HDMA (HBlank)",
        value: "%10000000"
      },
      B_VDMA_LEN_BUSY: {
        description: "on read: is a VRAM DMA active?",
        value: "7"
      },
      VDMA_LEN_BUSY: {
        description: "on read: is a VRAM DMA active?",
        value: "%10000000"
      },
      VDMA_LEN_NO: {
        description: "a VRAM DMA is not active",
        value: "%00000000"
      },
      VDMA_LEN_YES: {
        description: "a VRAM DMA is active",
        value: "%10000000"
      },
      VDMA_LEN_SIZE: {
        description: "how many 16-byte blocks (minus 1) to transfer [r/w]",
        value: "%0_1111111"
      }
    }
  },
  rRP: {
    value: "$FF56",
    description: "(CGB only) Infrared communications port",
    flags: {
      RP_READ: {
        description: "whether the IR read is enabled [r/w]",
        value: "%11_000000"
      },
      RP_DISABLE: {
        description: "the IR read is disabled",
        value: "%00_000000"
      },
      RP_ENABLE: {
        description: "the IR read is enabled",
        value: "%11_000000"
      },
      B_RP_DATA_IN: {
        description: "0 = IR light is being received [ro]",
        value: "1"
      },
      B_RP_LED_ON: {
        description: "1 = IR light is being sent [r/w]",
        value: "0"
      },
      RP_DATA_IN: {
        description: "0 = IR light is being received [ro]",
        value: "%00000010"
      },
      RP_LED_ON: {
        description: "1 = IR light is being sent [r/w]",
        value: "%00000001"
      },
      RP_WRITE_LOW: {
        description: "IR light is not being sent",
        value: "%00000000"
      },
      RP_WRITE_HIGH: {
        description: "IR light is being sent",
        value: "%00000001"
      }
    }
  },
  rBGPI: {
    value: "$FF68",
    alias: "rBCPS",
    description: "(CGB only) Background palette I/O index",
    flags: {
      B_BGPI_AUTOINC: {
        description: "whether the index field is incremented after each write to BCPD [r/w]",
        value: "7"
      },
      BGPI_AUTOINC: {
        description: "whether the index field is incremented after each write to BCPD [r/w]",
        value: "%10000000"
      },
      BGPI_INDEX: {
        description: "the index within Palette RAM accessed via BCPD [r/w]",
        value: "%00_111111"
      }
    }
  },
  rBGPD: {
    value: "$FF69",
    alias: "rBCPD",
    description: "(CGB only) Background palette I/O access [r/w]"
  },
  rOBPI: {
    value: "$FF6A",
    alias: "rOCPS",
    description: "(CGB only) OBJ palette I/O index",
    flags: {
      B_OBPI_AUTOINC: {
        description: "whether the index field is incremented after each write to OBPD [r/w]",
        value: "7"
      },
      OBPI_AUTOINC: {
        description: "whether the index field is incremented after each write to OBPD [r/w]",
        value: "%10000000"
      },
      OBPI_INDEX: {
        description: "the index within Palette RAM accessed via OBPD [r/w]",
        value: "%00_111111"
      }
    }
  },
  rOBPD: {
    value: "$FF6B",
    alias: "rOCPD",
    description: "(CGB only) OBJ palette I/O access [r/w]"
  },
  rOPRI: {
    value: "$FF6C",
    description: "(CGB boot ROM only) OBJ draw priority mode",
    flags: {
      B_OPRI_PRIORITY: {
        description: "which drawing priority is used for OBJs [r/w]",
        value: "0"
      },
      OPRI_PRIORITY: {
        description: "which drawing priority is used for OBJs [r/w]",
        value: "%00000001"
      },
      OPRI_OAM: {
        description: "CGB mode default: earliest OBJ in OAM wins",
        value: "%00000000"
      },
      OPRI_COORD: {
        description: "DMG mode default: leftmost OBJ wins",
        value: "%00000001"
      }
    }
  },
  rWBK: {
    value: "$FF70",
    alias: "rSVBK",
    description: "(CGB only) WRAM bank number",
    flags: {
      WBK_BANK: {
        description: "mapped WRAM bank (0-7) [r/w]",
        value: "%00000_111"
      }
    }
  },
  rPCM12: {
    value: "$FF76",
    description: "Audio channels 1 and 2 output",
    flags: {
      PCM12_CH2: {
        description: "audio channel 2 output [ro]",
        value: "%1111_0000"
      },
      PCM12_CH1: {
        description: "audio channel 1 output [ro]",
        value: "%0000_1111"
      }
    }
  },
  rPCM34: {
    value: "$FF77",
    description: "Audio channels 3 and 4 output",
    flags: {
      PCM34_CH4: {
        description: "audio channel 4 output [ro]",
        value: "%1111_0000"
      },
      PCM34_CH3: {
        description: "audio channel 3 output [ro]",
        value: "%0000_1111"
      }
    }
  },
  rIE: {
    value: "$FFFF",
    description: "Interrupt enable",
    flags: {
      B_IE_JOYPAD: {
        description: "1 = joypad interrupt is enabled [r/w]",
        value: "4"
      },
      B_IE_SERIAL: {
        description: "1 = serial interrupt is enabled [r/w]",
        value: "3"
      },
      B_IE_TIMER: {
        description: "1 = timer interrupt is enabled [r/w]",
        value: "2"
      },
      B_IE_STAT: {
        description: "1 = STAT interrupt is enabled [r/w]",
        value: "1"
      },
      B_IE_VBLANK: {
        description: "1 = VBlank interrupt is enabled [r/w]",
        value: "0"
      },
      IE_JOYPAD: {
        description: "1 = joypad interrupt is enabled [r/w]",
        value: "%00010000"
      },
      IE_SERIAL: {
        description: "1 = serial interrupt is enabled [r/w]",
        value: "%00001000"
      },
      IE_TIMER: {
        description: "1 = timer interrupt is enabled [r/w]",
        value: "%00000100"
      },
      IE_STAT: {
        description: "1 = STAT interrupt is enabled [r/w]",
        value: "%00000010"
      },
      IE_VBLANK: {
        description: "1 = VBlank interrupt is enabled [r/w]",
        value: "%00000001"
      }
    }
  },
  // Cartridge registers (MBC)
  rRAMG: {
    value: "$0000",
    description: "Whether SRAM can be accessed [wo]",
    flags: {
      RAMG_SRAM_DISABLE: {
        description: "SRAM cannot be accessed (not for HuC1 or HuC-3)",
        value: "$00"
      },
      RAMG_SRAM_ENABLE: {
        description: "SRAM can be accessed (not for HuC1 or HuC-3)",
        value: "$0A"
      },
      RAMG_CART_RAM_RO: {
        description: "(HuC-3 only) select cartridge RAM [ro]",
        value: "$00"
      },
      RAMG_CART_RAM: {
        description: "(HuC-3 only) select cartridge RAM [r/w]",
        value: "$0A"
      },
      RAMG_RTC_IN: {
        description: "(HuC-3 only) select RTC command/argument [wo]",
        value: "$0B"
      },
      RAMG_RTC_IN_CMD: {
        description: "(HuC-3 only) RTC command",
        value: "%0_111_0000"
      },
      RAMG_RTC_IN_ARG: {
        description: "(HuC-3 only) RTC argument",
        value: "%0_000_1111"
      },
      RAMG_RTC_OUT: {
        description: "(HuC-3 only) select RTC command/response [ro]",
        value: "$0C"
      },
      RAMG_RTC_OUT_CMD: {
        description: "(HuC-3 only) RTC command",
        value: "%0_111_0000"
      },
      RAMG_RTC_OUT_RESULT: {
        description: "(HuC-3 only) RTC result",
        value: "%0_000_1111"
      },
      RAMG_RTC_SEMAPHORE: {
        description: "(HuC-3 only) select RTC semaphore [r/w]",
        value: "$0D"
      },
      RAMG_IR: {
        description: "(HuC1 and HuC-3 only) select IR [r/w]",
        value: "$0E"
      }
    }
  },
  rROMB: {
    value: "$2000",
    description: "ROM bank number (not for MBC5 or MBC6) [wo]"
  },
  rRAMB: {
    value: "$4000",
    description: "SRAM bank number (not for MBC2, MBC6, or MBC7) [wo]",
    flags: {
      RAMB_RTC_S: {
        description: "(MBC3 only) seconds counter (0-59)",
        value: "$08"
      },
      RAMB_RTC_M: {
        description: "(MBC3 only) minutes counter (0-59)",
        value: "$09"
      },
      RAMB_RTC_H: {
        description: "(MBC3 only) hours counter (0-23)",
        value: "$0A"
      },
      RAMB_RTC_DL: {
        description: "(MBC3 only) days counter, low byte (0-255)",
        value: "$0B"
      },
      RAMB_RTC_DH: {
        description: "(MBC3 only) days counter, high bit and other flags",
        value: "$0C"
      },
      B_RAMB_RTC_DH_CARRY: {
        description: "(MBC3 only) 1 = days counter overflowed [wo]",
        value: "7"
      },
      B_RAMB_RTC_DH_HALT: {
        description: "(MBC3 only) 0 = run timer, 1 = stop timer [wo]",
        value: "6"
      },
      B_RAMB_RTC_DH_HIGH: {
        description: "(MBC3 only) days counter, high bit (bit 8) [wo]",
        value: "0"
      },
      RAMB_RTC_DH_CARRY: {
        description: "(MBC3 only) 1 = days counter overflowed [wo]",
        value: "%10000000"
      },
      RAMB_RTC_DH_HALT: {
        description: "(MBC3 only) 0 = run timer, 1 = stop timer [wo]",
        value: "%01000000"
      },
      RAMB_RTC_DH_HIGH: {
        description: "(MBC3 only) days counter, high bit (bit 8) [wo]",
        value: "%00000001"
      },
      B_RAMB_RUMBLE: {
        description: "(MBC5 and MBC7 only) enable the rumble motor (if any)",
        value: "3"
      },
      RAMB_RUMBLE: {
        description: "(MBC5 and MBC7 only) enable the rumble motor (if any)",
        value: "%00001000"
      },
      RAMB_RUMBLE_OFF: {
        description: "(MBC5 and MBC7 only) disable the rumble motor (if any)",
        value: "%00000000"
      },
      RAMB_RUMBLE_ON: {
        description: "(MBC5 and MBC7 only) enable the rumble motor (if any)",
        value: "%00001000"
      }
    }
  },
  rBMODE: {
    value: "$6000",
    description: "(MBC1 and MMM01 only) Banking mode select [wo]",
    flags: {
      BMODE_SIMPLE: {
        description: "locks ROMB and RAMB to bank 0",
        value: "$00"
      },
      BMODE_ADVANCED: {
        description: "allows bank-switching with RAMB",
        value: "$01"
      }
    }
  },
  rROM2B: {
    value: "$2100",
    description: "(MBC2 only) ROM bank number [wo]"
  },
  rRTCLATCH: {
    value: "$6000",
    description: "(MBC3 only) RTC latch clock data [wo]",
    flags: {
      RTCLATCH_START: {
        description: "Write $00 then $01 to latch the current time into RTCREG",
        value: "$00"
      },
      RTCLATCH_FINISH: {
        description: "Write $00 then $01 to latch the current time into RTCREG",
        value: "$01"
      }
    }
  },
  rRTCREG: {
    value: "$A000",
    description: "(MBC3 only) RTC register [r/w]"
  },
  rROMB0: {
    value: "$2000",
    description: "(MBC5 only) ROM bank number low byte (bits 0-7) [wo]"
  },
  rROMB1: {
    value: "$3000",
    description: "(MBC5 only) ROM bank number high bit (bit 8) [wo]"
  },
  rRAMBA: {
    value: "$0400",
    description: "(MBC6 only) RAM bank A number [wo]"
  },
  rRAMBB: {
    value: "$0800",
    description: "(MBC6 only) RAM bank B number [wo]"
  },
  rFLASH: {
    value: "$0C00",
    description: "(MBC6 only) Whether the flash chip can be accessed [wo]"
  },
  rFMODE: {
    value: "$1000",
    description: "(MBC6 only) Write mode select for the flash chip"
  },
  rROMBA: {
    value: "$2000",
    description: "(MBC6 only) ROM/Flash bank A number [wo]"
  },
  rFLASHA: {
    value: "$2800",
    description: "(MBC6 only) ROM/Flash bank A select [wo]"
  },
  rROMBB: {
    value: "$3000",
    description: "(MBC6 only) ROM/Flash bank B number [wo]"
  },
  rFLASHB: {
    value: "$3800",
    description: "(MBC6 only) ROM/Flash bank B select [wo]"
  },
  rRAMREG: {
    value: "$4000",
    description: "(MBC7 only) Enable RAM register access [wo]",
    flags: {
      RAMREG_ENABLE: {
        description: "Enable RAM register access",
        value: "$40"
      }
    }
  },
  rACCLATCH0: {
    value: "$A000",
    description: "(MBC7 only) Latch accelerometer start [wo]",
    flags: {
      ACCLATCH0_START: {
        description: "",
        value: "$55"
      }
    }
  },
  rACCLATCH1: {
    value: "$A010",
    description: "(MBC7 only) Latch accelerometer finish [wo]",
    flags: {
      ACCLATCH1_FINISH: {
        description: "",
        value: "$AA"
      }
    }
  },
  rACCELX0: {
    value: "$A020",
    description: "(MBC7 only) Accelerometer X value low byte [ro]"
  },
  rACCELX1: {
    value: "$A030",
    description: "(MBC7 only) Accelerometer X value high byte [ro]"
  },
  rACCELY0: {
    value: "$A040",
    description: "(MBC7 only) Accelerometer Y value low byte [ro]"
  },
  rACCELY1: {
    value: "$A050",
    description: "(MBC7 only) Accelerometer Y value high byte [ro]"
  },
  rEEPROM: {
    value: "$A080",
    description: "(MBC7 only) EEPROM access [r/w]"
  },
  rIRREG: {
    value: "$A000",
    description: "(HuC1 only) IR register [r/w]",
    flags: {
      IR_LED_OFF: {
        description: "",
        value: "$C0"
      },
      IR_LED_ON: {
        description: "",
        value: "$C1"
      }
    }
  },

  // Screen-related constants
  SCREEN_WIDTH_PX: {
    description: "width of screen in pixels",
    value: "160"
  },
  SCREEN_HEIGHT_PX: {
    description: "height of screen in pixels",
    value: "144"
  },
  SCREEN_WIDTH: {
    description: "width of screen in bytes",
    value: "20"
  },
  SCREEN_HEIGHT: {
    description: "height of screen in bytes",
    value: "18"
  },
  SCREEN_AREA: {
    description: "size of screen in bytes",
    value: "360"
  },
  TILEMAP_WIDTH_PX: {
    description: "width of tilemap in pixels",
    value: "256"
  },
  TILEMAP_HEIGHT_PX: {
    description: "height of tilemap in pixels",
    value: "256"
  },
  TILEMAP_WIDTH: {
    description: "width of tilemap in bytes",
    value: "32"
  },
  TILEMAP_HEIGHT: {
    description: "height of tilemap in bytes",
    value: "32"
  },
  TILEMAP_AREA: {
    description: "size of tilemap in bytes",
    value: "1024"
  },
  TILE_WIDTH: {
    description: "width of tile in pixels",
    value: "8"
  },
  TILE_HEIGHT: {
    description: "height of tile in pixels",
    value: "8"
  },
  TILE_SIZE: {
    description: "size of tile in bytes (2 bits/pixel)",
    value: "16"
  },
  COLOR_SIZE: {
    description: "size of color in bytes (little-endian BGR555)",
    value: "2"
  },
  B_COLOR_RED: {
    description: "color bits 4-0",
    value: "0"
  },
  B_COLOR_GREEN: {
    description: "color bits 9-5",
    value: "5"
  },
  B_COLOR_BLUE: {
    description: "color bits 14-10",
    value: "10"
  },
  COLOR_RED: {
    description: "for the low color byte",
    value: "%000_11111"
  },
  COLOR_GREEN_LOW: {
    description: "for the low color byte",
    value: "%111_00000"
  },
  COLOR_GREEN_HIGH: {
    description: "for the high color byte",
    value: "%0_00000_11"
  },
  COLOR_BLUE: {
    description: "for the high color byte",
    value: "%0_11111_00"
  },
  PAL_COLORS: {
    description: "colors per palette",
    value: "4"
  },
  PAL_SIZE: {
    description: "size of palette in bytes",
    value: "8"
  },
  TILEMAP0: {
    description: "$9800-$9BFF",
    value: "$9800"
  },
  TILEMAP1: {
    description: "$9C00-$9FFF",
    value: "$9C00"
  },
  B_BG_PRIO: {
    description: "(CGB only) whether the BG tile colors 1-3 are drawn above OBJs",
    value: "7"
  },
  B_BG_YFLIP: {
    description: "(CGB only) whether the whole BG tile is flipped vertically",
    value: "6"
  },
  B_BG_XFLIP: {
    description: "(CGB only) whether the whole BG tile is flipped horizontally",
    value: "5"
  },
  B_BG_BANK1: {
    description: "(CGB only) which VRAM bank the BG tile is taken from",
    value: "3"
  },
  BG_PALETTE: {
    description: "(CGB only) which palette the BG tile uses",
    value: "%00000_111"
  },
  BG_PRIO: {
    description: "(CGB only) whether the BG tile colors 1-3 are drawn above OBJs",
    value: "%10000000"
  },
  BG_YFLIP: {
    description: "(CGB only) whether the whole BG tile is flipped vertically",
    value: "%01000000"
  },
  BG_XFLIP: {
    description: "(CGB only) whether the whole BG tile is flipped horizontally",
    value: "%00100000"
  },
  BG_BANK0: {
    description: "(CGB only) the BG tile is taken from VRAM bank 0",
    value: "%00000000"
  },
  BG_BANK1: {
    description: "(CGB only) the BG tile is taken from VRAM bank 1",
    value: "%00001000"
  },

  // OBJ-related constants
  OAMA_Y: {
    description: "OAM attribute field offset for OBJ Y coordinate",
    value: "0",
    flags: {
      OAM_Y_OFS: {
        description: "subtract 16 from what's written to OAM to get the real Y position",
        value: "16"
      }
    }
  },
  OAMA_X: {
    description: "OAM attribute field offset for OBJ X coordinate",
    value: "1",
    flags: {
      OAM_X_OFS: {
        description: "subtract 8 from what's written to OAM to get the real X position",
        value: "8"
      }
    }
  },
  OAMA_TILEID: {
    description: "OAM attribute field offset for OBJ tile ID",
    value: "2"
  },
  OAMA_FLAGS: {
    description: "OAM attribute field offset for OBJ attribute flags",
    value: "3",
    flags: {
      B_OAM_PRIO: {
        description: "whether the OBJ is drawn below BG colors 1-3",
        value: "7"
      },
      B_OAM_YFLIP: {
        description: "whether the whole OBJ is flipped vertically",
        value: "6"
      },
      B_OAM_XFLIP: {
        description: "whether the whole OBJ is flipped horizontally",
        value: "5"
      },
      B_OAM_PAL1: {
        description: "(DMG only) which of the two palettes the OBJ uses",
        value: "4"
      },
      B_OAM_BANK1: {
        description: "(CGB only) which VRAM bank the OBJ takes its tile(s) from",
        value: "3"
      },
      OAM_PALETTE: {
        description: "(CGB only) which palette the OBJ uses",
        value: "%00000_111"
      },
      OAM_PRIO: {
        description: "whether the OBJ is drawn below BG colors 1-3",
        value: "%10000000"
      },
      OAM_YFLIP: {
        description: "whether the whole OBJ is flipped vertically",
        value: "%01000000"
      },
      OAM_XFLIP: {
        description: "whether the whole OBJ is flipped horizontally",
        value: "%00100000"
      },
      OAM_PAL0: {
        description: "(DMG only) which of the two palettes the OBJ uses",
        value: "%00000000"
      },
      OAM_PAL1: {
        description: "(DMG only) which of the two palettes the OBJ uses",
        value: "%00010000"
      },
      OAM_BANK0: {
        description: "(CGB only) which VRAM bank the OBJ takes its tile(s) from",
        value: "%00000000"
      },
      OAM_BANK1: {
        description: "(CGB only) which VRAM bank the OBJ takes its tile(s) from",
        value: "%00001000"
      },
    }
  },
  OBJ_SIZE: {
    description: "size of OBJ in bytes",
    value: "4"
  },
  OAM_COUNT: {
    description: "how many OBJs there are room for in OAM",
    value: "40"
  },
  OAM_SIZE: {
    description: "size of OAM RAM in bytes",
    value: "160"
  },

  // Interrupt vector addresses
  INT_HANDLER_VBLANK: {
    description: "VBlank interrupt handler address",
    value: "$0040"
  },
  INT_HANDLER_STAT: {
    description: "STAT interrupt handler address",
    value: "$0048"
  },
  INT_HANDLER_TIMER: {
    description: "timer interrupt handler address",
    value: "$0050"
  },
  INT_HANDLER_SERIAL: {
    description: "serial interrupt handler address",
    value: "$0058"
  },
  INT_HANDLER_JOYPAD: {
    description: "joypad interrupt handler address",
    value: "$0060"
  },

  // Boot-up register values
  BOOTUP_A_DMG: {
    description: "Register A = CPU type",
    value: "$01"
  },
  BOOTUP_A_CGB: {
    description: "Register A = CPU type",
    value: "$11"
  },
  BOOTUP_A_MGB: {
    description: "Register A = CPU type",
    value: "$FF"
  },
  BOOTUP_A_SGB: {
    description: "Register A = CPU type",
    value: "$01"
  },
  BOOTUP_A_SGB2: {
    description: "Register A = CPU type",
    value: "$FF"
  },
  B_BOOTUP_B_AGB: {
    description: "Register B = CPU qualifier (if A is BOOTUP_A_CGB)",
    value: "0"
  },
  BOOTUP_B_CGB: {
    description: "Register B = CPU qualifier (if A is BOOTUP_A_CGB)",
    value: "%00000000"
  },
  BOOTUP_B_AGB: {
    description: "Register B = CPU qualifier (if A is BOOTUP_A_CGB)",
    value: "%00000001"
  },

  // Combined input bytes
  B_PAD_DOWN: {
    description: "",
    value: "7"
  },
  B_PAD_UP: {
    description: "",
    value: "6"
  },
  B_PAD_LEFT: {
    description: "",
    value: "5"
  },
  B_PAD_RIGHT: {
    description: "",
    value: "4"
  },
  B_PAD_START: {
    description: "",
    value: "3"
  },
  B_PAD_SELECT: {
    description: "",
    value: "2"
  },
  B_PAD_B: {
    description: "",
    value: "1"
  },
  B_PAD_A: {
    description: "",
    value: "0"
  },
  PAD_CTRL_PAD: {
    description: "",
    value: "%1111_0000"
  },
  PAD_BUTTONS: {
    description: "",
    value: "%0000_1111"
  },
  PAD_DOWN: {
    description: "1 << B_PAD_DOWN",
    value: "%10000000"
  },
  PAD_UP: {
    description: "1 << B_PAD_UP",
    value: "%01000000"
  },
  PAD_LEFT: {
    description: "1 << B_PAD_LEFT",
    value: "%00100000"
  },
  PAD_RIGHT: {
    description: "1 << B_PAD_RIGHT",
    value: "%00010000"
  },
  PAD_START: {
    description: "1 << B_PAD_START",
    value: "%00001000"
  },
  PAD_SELECT: {
    description: "1 << B_PAD_SELECT",
    value: "%00000100"
  },
  PAD_B: {
    description: "1 << B_PAD_B",
    value: "%00000010"
  },
  PAD_A: {
    description: "1 << B_PAD_A",
    value: "%00000001"
  },
  B_PAD_SWAP_START: {
    description: "",
    value: "7"
  },
  B_PAD_SWAP_SELECT: {
    description: "",
    value: "6"
  },
  B_PAD_SWAP_B: {
    description: "",
    value: "5"
  },
  B_PAD_SWAP_A: {
    description: "",
    value: "4"
  },
  B_PAD_SWAP_DOWN: {
    description: "",
    value: "3"
  },
  B_PAD_SWAP_UP: {
    description: "",
    value: "2"
  },
  B_PAD_SWAP_LEFT: {
    description: "",
    value: "1"
  },
  B_PAD_SWAP_RIGHT: {
    description: "",
    value: "0"
  },
  PAD_SWAP_CTRL_PAD: {
    description: "",
    value: "%0000_1111"
  },
  PAD_SWAP_BUTTONS: {
    description: "",
    value: "%1111_0000"
  },
  PAD_SWAP_START: {
    description: "1 << B_PAD_SWAP_START",
    value: "%10000000"
  },
  PAD_SWAP_SELECT: {
    description: "1 << B_PAD_SWAP_SELECT",
    value: "%01000000"
  },
  PAD_SWAP_B: {
    description: "1 << B_PAD_SWAP_B",
    value: "%00100000"
  },
  PAD_SWAP_A: {
    description: "1 << B_PAD_SWAP_A",
    value: "%00010000"
  },
  PAD_SWAP_DOWN: {
    description: "1 << B_PAD_SWAP_DOWN",
    value: "%00001000"
  },
  PAD_SWAP_UP: {
    description: "1 << B_PAD_SWAP_UP",
    value: "%00000100"
  },
  PAD_SWAP_LEFT: {
    description: "1 << B_PAD_SWAP_LEFT",
    value: "%00000010"
  },
  PAD_SWAP_RIGHT: {
    description: "1 << B_PAD_SWAP_RIGHT",
    value: "%00000001"
  },
};

for (var key in gameboy_hardware_constants) {
  if (typeof gameboy_hardware_constants[key].flags == 'string')
    gameboy_hardware_constants[key].flags = gameboy_hardware_constants[gameboy_hardware_constants[key].flags].flags;
  if (gameboy_hardware_constants[key].flags) {
    for (var flag in gameboy_hardware_constants[key].flags)
      gameboy_hardware_constants[flag] = gameboy_hardware_constants[key].flags[flag];
  }
  if (gameboy_hardware_constants[key].alias) {
    gameboy_hardware_constants[gameboy_hardware_constants[key].alias] = Object.assign(
      {},
      gameboy_hardware_constants[key],
    );
    gameboy_hardware_constants[gameboy_hardware_constants[key].alias].alias = key;
  }
}

export { gameboy_hardware_constants };
