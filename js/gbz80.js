const gameboy_hardware_constants = {
  _HW: {
    description: "Start of the hardware IO registers.",
    value: "$FF00->$FF80",
  },
  _VRAM: {
    description: "VRAM Memory",
    value: "$8000->$9FFF",
  },
  _SCRN0: {
    description: "Background 0 Memory",
    value: "$9800->$9BFF",
  },
  _SCRN1: {
    description: "Background 1 Memory",
    value: "$9C00->$9FFF",
  },
  _SRAM: {
    description: "Card SRAM",
    value: "$A000->$BFFF",
  },
  _RAM: {
    description: "WRAM Memory",
    value: "$C000->$DFFF",
  },
  _OAMRAM: {
    description: "OAM Memory",
    value: "$FE00->$FE9F",

    flags: {
      OAMF_PRI: {
        value: "%10000000",
        description:
          "Flag to set on OAM attribute byte to make the background colors 1-3 to have priority over the sprite.",
      },
      OAMF_YFLIP: {
        value: "%01000000",
        description:
          "Flag to set on OAM attribute byte to make the sprite flip in the Y direction",
      },
      OAMF_XFLIP: {
        value: "%00100000",
        description:
          "Flag to set on OAM attribute byte to make the sprite flip in the X direction",
      },
      OAMF_PAL0: {
        value: "%00000000",
        description:
          "Flag to set on OAM attribute byte to make the sprite use OBP0 in DMG (non-color) mode.",
      },
      OAMF_PAL1: {
        value: "%00010000",
        description:
          "Flag to set on OAM attribute byte to make the sprite use OBP1 in DMG (non-color) mode.",
      },
      OAMF_BANK0: {
        value: "%00000000",
        description:
          "Flag to set on OAM attribute byte to use a sprite graphics from VRAM Bank 0 in GBC mode.",
      },
      OAMF_BANK1: {
        value: "%00001000",
        description:
          "Flag to set on OAM attribute byte to use a sprite graphics from VRAM Bank 1 in GBC mode.",
      },
      OAMF_PALMASK: {
        value: "%00000111",
        description:
          "Mask of the color sprite palette index in the OAM attribute byte. In GBC mode.",
      },

      OAMB_PRI: {
        value: "7",
        description:
          "Bit number to set on OAM attribute byte to make the background colors 1-3 to have priority over the sprite.",
      },
      OAMB_YFLIP: {
        value: "6",
        description:
          "Bit number to set on OAM attribute byte to make the sprite flip in the Y direction.",
      },
      OAMB_XFLIP: {
        value: "5",
        description:
          "Bit number to set on OAM attribute byte to make the sprite flip in the X direction.",
      },
      OAMB_PAL1: {
        value: "4",
        description:
          "Bit number to set on OAM attribute byte to make the sprite use OBP1 in DMG (non-color) mode.",
      },
      OAMB_BANK1: {
        value: "3",
        description:
          "Bit number to set on OAM attribute byte to use a sprite graphics from VRAM Bank 1 in GBC mode.",
      },
    },
  },
  _AUD3WAVERAM: {
    description: "WAVE Channel Memory",
    value: "$FF30->$FF3F",
  },
  _HRAM: {
    description: "HRAM Memory",
    value: "$FF80->$FFFE",
  },

  // MBC5 related, ignored.
  //"rRAMG": { description: "$0000 ; $0000->$1fff
  //"rROMB0": { description: "$2000 ; $2000->$2fff
  //"rROMB1": { description: "$3000 ; $3000->$3fff - If more than 256 ROM banks are present.
  //"rRAMB": { description: "$4000 ; $4000->$5fff - Bit 3 enables rumble (if present)

  // IO Registers
  rP1: {
    description: "Register for reading joy pad info. (R/W)",
    value: "$FF00",
    flags: {
      P1F_5: {
        value: "%00100000",
        description: "P15 out port, set to 0 to get buttons",
      },
      P1F_4: {
        value: "%00010000",
        description: "P14 out port, set to 0 to get dpad",
      },
      P1F_3: { value: "%00001000", description: "P13 in port" },
      P1F_2: { value: "%00000100", description: "P12 in port" },
      P1F_1: { value: "%00000010", description: "P11 in port" },
      P1F_0: { value: "%00000001", description: "P10 in port" },

      P1F_GET_DPAD: {
        description:
          "Value to load in rP1 to enable the reading of the DPad inputs.",
      },
      P1F_GET_BTN: {
        description:
          "Value to load in rP1 to enable the reading of the A/B/Start/Select inputs.",
      },
      P1F_GET_NONE: {
        description:
          "Value to load in rP1 to disable the reading of input buttons.",
      },
    },
  },

  rSB: {
    description: "Serial Transfer Data (R/W)",
    value: "$FF01",
  },
  rSC: {
    description: "Serial I/O Control (R/W)",
    value: "$FF02",
  },

  rDIV: {
    description:
      "Divider register (R/W)\nIncremented at 16384Hz or 32768Hz depending on the CPU speed.\nWrite any value to reset to zero.",
    value: "$FF04",
  },

  rTIMA: {
    description: "Timer counter (R/W)",
    value: "$FF05",
  },

  rTMA: {
    description: "Timer modulo (R/W)",
    value: "$FF06",
  },

  rTAC: {
    description: "Timer control (R/W)",
    value: "$FF07",
    flags: {
      TACF_START: { value: "%00000100" },
      TACF_STOP: { value: "%00000000" },
      TACF_4KHZ: { value: "%00000000" },
      TACF_16KHZ: { value: "%00000011" },
      TACF_65KHZ: { value: "%00000010" },
      TACF_262KHZ: { value: "%00000001" },
    },
  },

  rIF: {
    description:
      "Interrupt Flag (R/W)\nContains the currently 'ready' interrupts, set by hardware, cleared when interrupt is executed.\nGenerally only written to zero to clear pending interrupts before enabling interrupts.",
    value: "$FF0F",
    flags: "rIE",
  },

  rLCDC: {
    description: "LCD Control (R/W)",
    value: "$FF40",
    flags: {
      LCDCF_OFF: { value: "%00000000", description: "LCD Control Operation" },
      LCDCF_ON: { value: "%10000000", description: "LCD Control Operation" },
      LCDCF_WIN9800: {
        value: "%00000000",
        description: "Window Tile Map Display Select",
      },
      LCDCF_WIN9C00: {
        value: "%01000000",
        description: "Window Tile Map Display Select",
      },
      LCDCF_WINOFF: { value: "%00000000", description: "Window Display" },
      LCDCF_WINON: { value: "%00100000", description: "Window Display" },
      LCDCF_BG8800: {
        value: "%00000000",
        description: "BG & Window Tile Data Select",
      },
      LCDCF_BG8000: {
        value: "%00010000",
        description: "BG & Window Tile Data Select",
      },
      LCDCF_BG9800: {
        value: "%00000000",
        description: "BG Tile Map Display Select",
      },
      LCDCF_BG9C00: {
        value: "%00001000",
        description: "BG Tile Map Display Select",
      },
      LCDCF_OBJ8: { value: "%00000000", description: "OBJ Construction" },
      LCDCF_OBJ16: { value: "%00000100", description: "OBJ Construction" },
      LCDCF_OBJOFF: { value: "%00000000", description: "OBJ Display" },
      LCDCF_OBJON: { value: "%00000010", description: "OBJ Display" },
      LCDCF_BGOFF: { value: "%00000000", description: "BG Display" },
      LCDCF_BGON: { value: "%00000001", description: "BG Display" },
    },
  },

  rSTAT: {
    description: "LCDC Status (R/W)",
    value: "$FF41",
    flags: {
      STATF_LYC: {
        value: "%01000000",
        description: "LYC=LY Coincidence interrupt enabled (writable)",
      },
      STATF_MODE10: {
        value: "%00100000",
        description: "Mode 10 OAM STAT interrupt enabled (writable)",
      },
      STATF_MODE01: {
        value: "%00010000",
        description: "Mode 01 V-Blank STAT interrupt enabled (writable)",
      },
      STATF_MODE00: {
        value: "%00001000",
        description: "Mode 00 H-Blank STAT interrupt enabled (writable)",
      },
      STATF_LYCF: { value: "%00000100", description: "Coincidence Flag" },
      STATF_HB: { value: "%00000000", description: "H-Blank" },
      STATF_VB: { value: "%00000001", description: "V-Blank" },
      STATF_OAM: {
        value: "%00000010",
        description: "OAM-RAM is used by system",
      },
      STATF_LCD: {
        value: "%00000011",
        description: "Both OAM and VRAM used by system",
      },
      STATF_BUSY: {
        value: "%00000010",
        description: "When set, VRAM access is unsafe",
      },
    },
  },

  rSCY: {
    description: "Scroll Y (R/W)",
    value: "$FF42",
  },
  rSCX: {
    description: "Scroll X (R/W)",
    value: "$FF43",
  },

  rLY: {
    description:
      "LCDC Y-Coordinate (R)<br>Values range from 0->153. 144->153 is the VBlank period.",
    value: "$FF44",
  },

  rLYC: {
    description:
      "LY Compare (R/W)<br>When LY==LYC, STATF_LYCF will be set in STAT",
    value: "$FF45",
  },

  rDMA: {
    description: "DMA Transfer and Start Address (W)",
    value: "$FF46",
  },

  rBGP: {
    description:
      "BG Palette Data (W)<br>Bit 7-6 - Intensity for %11<br>Bit 5-4 - Intensity for %10<br>Bit 3-2 - Intensity for %01<br>Bit 1-0 - Intensity for %00",
    value: "$FF47",
  },

  rOBP0: {
    description:
      "Object Palette 0 Data (W)<br>Bit 7-6 - Intensity for %11<br>Bit 5-4 - Intensity for %10<br>Bit 3-2 - Intensity for %01<br>Bit 1-0 - Ignored, %00 is transparent",
    value: "$FF48",
  },
  rOBP1: {
    description:
      "Object Palette 1 Data (W)<br>Bit 7-6 - Intensity for %11<br>Bit 5-4 - Intensity for %10<br>Bit 3-2 - Intensity for %01<br>Bit 1-0 - Ignored, %00 is transparent",
    value: "$FF49",
  },

  rWY: {
    description: "Window Y Position (R/W)<br>0 <= WY <= 143",
    value: "$FF4A",
  },
  rWX: {
    description: "Window X Position (R/W)<br>7 <EQU WX <EQU 166",
    value: "$FF4B",
  },

  rKEY1: {
    description:
      "Select CPU Speed (R/W) GBC Only!<br>Bit 7 contains current speed: 1 is double speed.<br>Write bit 0 to 1 and execute a STOP instruction to switch speed.",
    value: "$FF4D",
  },

  rVBK: {
    description: "Select Video RAM Bank (R/W) GBC Only!",
    value: "$FF4F",
  },

  rHDMA1: {
    description: "Horizontal Blanking, General Purpose DMA (W) GBC Only!",
    value: "$FF51",
  },
  rHDMA2: {
    description: "Horizontal Blanking, General Purpose DMA (W) GBC Only!",
    value: "$FF52",
  },
  rHDMA3: {
    description: "Horizontal Blanking, General Purpose DMA (W) GBC Only!",
    value: "$FF53",
  },
  rHDMA4: {
    description: "Horizontal Blanking, General Purpose DMA (W) GBC Only!",
    value: "$FF54",
  },
  rHDMA5: {
    description: "Horizontal Blanking, General Purpose DMA (R/W) GBC Only!",
    value: "$FF55",
  },

  rRP: {
    description: "Infrared Communications Port (R/W) GBC Only!",
    value: "$FF56",
  },

  rBCPS: {
    description: "Background Color Palette Specification (R/W) GBC Only!",
    value: "$FF68",
  },
  rBCPD: {
    description: "Background Color Palette Data (R/W) GBC Only!",
    value: "$FF69",
  },

  rOCPS: {
    description: "Object Color Palette Specification (R/W) GBC Only!",
    value: "$FF6A",
  },

  rOCPD: {
    description: "Object Color Palette Data (R/W) GBC Only!",
    value: "$FF6B",
  },

  rSVBK: {
    description: "Select Main RAM Bank (R/W) GBC Only!",
    value: "$FF70",
  },

  rIE: {
    description: "Interrupt Enable (R/W)",
    value: "$FFFF",
    flags: {
      IEF_HILO: {
        value: "%00010000",
        description: "Transition from High to Low of Pin number P10-P13",
      },
      IEF_SERIAL: {
        value: "%00001000",
        description: "Serial I/O transfer end",
      },
      IEF_TIMER: { value: "%00000100", description: "Timer Overflow" },
      IEF_LCDC: { value: "%00000010", description: "LCDC (see STAT)" },
      IEF_VBLANK: { value: "%00000001", description: "V-Blank" },
    },
  },

  //AUDVOL/NR50 ($FF24)
  rNR50: {
    description:
      "Channel control / ON-OFF / Volume (R/W)<br>Bit 7   - Vin->SO2 ON/OFF (Vin??)<br>Bit 6-4 - SO2 output level (volume) (# 0-7)<br>Bit 3   - Vin->SO1 ON/OFF (Vin??)<br>Bit 2-0 - SO1 output level (volume) (# 0-7)",
    value: "$FF24",
    alias: "rAUDVOL",
    /* flags: {
            "AUDVOL_VIN_LEFT": { value: "%10000000", description: "SO2"},
            "AUDVOL_VIN_RIGHT": { value: "%00001000", description: "SO1"},
        } */
  },

  //AUDTERM/NR51 ($FF25)
  rNR51: {
    description:
      "Selection of Sound output terminal (R/W)<br>Bit 7   - Output sound 4 to SO2 terminal<br>Bit 6   - Output sound 3 to SO2 terminal<br>Bit 5   - Output sound 2 to SO2 terminal<br>Bit 4   - Output sound 1 to SO2 terminal<br>Bit 3   - Output sound 4 to SO1 terminal<br>Bit 2   - Output sound 3 to SO1 terminal<br>Bit 1   - Output sound 2 to SO1 terminal<br>Bit 0   - Output sound 0 to SO1 terminal",
    value: "$FF25",
    alias: "rAUDTERM",
    flags: {
      //SO2
      AUDTERM_4_LEFT: { description: "%10000000" },
      AUDTERM_3_LEFT: { description: "%01000000" },
      AUDTERM_2_LEFT: { description: "%00100000" },
      AUDTERM_1_LEFT: { description: "%00010000" },
      //SO1
      AUDTERM_4_RIGHT: { description: "%00001000" },
      AUDTERM_3_RIGHT: { description: "%00000100" },
      AUDTERM_2_RIGHT: { description: "%00000010" },
      AUDTERM_1_RIGHT: { description: "%00000001" },
    },
  },

  //AUDENA/NR52 ($FF26)
  rNR52: {
    description:
      "Sound on/off (R/W)<br>Bit 7   - All sound on/off (sets all audio regs to 0!)<br>Bit 3   - Sound 4 ON flag (read only)<br>Bit 2   - Sound 3 ON flag (read only)<br>Bit 1   - Sound 2 ON flag (read only)<br>Bit 0   - Sound 1 ON flag (read only)",
    value: "$FF26",
    alias: "rAUDENA",
    flags: {
      AUDENA_ON: { description: "%10000000" },
      AUDENA_OFF: { description: "%00000000  ; sets all audio regs to 0!" },
    },
  },

  ///SoundChannel #1 registers

  //AUD1SWEEP/NR10 ($FF10)
  rNR10: {
    description:
      "Sweep register (R/W)<br>Bit 6-4 - Sweep Time<br>Bit 3   - Sweep Increase/Decrease<br>&nbsp; 0: Addition<br>&nbsp; 1: Subtraction<br>Bit 2-0 - Number of sweep shift (# 0-7)<br>Sweep Time: (n*7.8ms)",
    value: "$FF10",
    alias: "rAUD1SWEEP",
    flags: {
      AUD1SWEEP_UP: { description: "%00000000" },
      AUD1SWEEP_DOWN: { description: "%00001000" },
    },
  },

  //AUD1LEN/NR11 ($FF11)
  rNR11: {
    description:
      "Sound length/Wave pattern duty (R/W)<br>Bit 7-6 - Wave Pattern Duty (00:12.5% 01:25% 10:50% 11:75%)<br>Bit 5-0 - Sound length data (# 0-63)",
    value: "$FF11",
    alias: "rAUD1LEN",
    flags: {
      AUDLEN_DUTY_12_5: { value: "%00000000", description: "12.5%" },
      AUDLEN_DUTY_25: { value: "%01000000", description: "25%" },
      AUDLEN_DUTY_50: { value: "%10000000", description: "50%" },
      AUDLEN_DUTY_75: { value: "%11000000", description: "75%" },
    },
  },

  //AUD1ENV/NR12 ($FF12)
  rNR12: {
    description: `Envelope (R/W)
Bit 7-4 - Initial value of envelope
Bit 3   - Envelope UP/DOWN
        0: Decrease
        1: Range of increase
Bit 2-0 - Number of envelope sweep (# 0-7)`,
    value: "$FF12",
    alias: "rAUD1ENV",
    flags: {
      AUDENV_UP: { value: "%00001000" },
      AUDENV_DOWN: { value: "%00000000" },
    },
  },

  //AUD1LOW/NR13 ($FF13)
  rNR13: {
    description: "Frequency lo (W)",
    value: "$FF13",
    alias: "rAUD1LOW",
  },

  //AUD1HIGH/NR14 ($FF14)
  //Frequency hi (W)
  //
  //Bit 7   - Initial (when set, sound restarts)
  //Bit 6   - Counter/consecutive selection
  //Bit 2-0 - Frequency's higher 3 bits
  //
  rNR14: {
    description: "Frequency hi (W)",
    value: "$FF14",
    alias: "rAUD1HIGH",
    flags: {
      AUDHIGH_RESTART: { description: "%10000000" },
      AUDHIGH_LENGTH_ON: { description: "%01000000" },
      AUDHIGH_LENGTH_OFF: { description: "%00000000" },
    },
  },

  ///SoundChannel #2 registers

  rNR21: {
    description: "Sound Length; Wave Pattern Duty (R/W)",
    value: "$FF16",
    alias: "rAUD2LEN",
    flags: "rAUD1LEN",
  },
  rNR22: {
    description: "Envelope (R/W)",
    value: "$FF17",
    alias: "rAUD2ENV",
    flags: "rAUD1ENV",
  },
  rNR23: {
    description: "Frequency lo (W)",
    value: "$FF18",
    alias: "rAUD2LOW",
  },
  rNR24: {
    description: "Frequency hi (W)",
    value: "$FF19",
    alias: "rAUD2HIGH",
    flags: "rAUD1HIGH",
  },

  ///SoundChannel #3 registers
  rNR30: {
    description: "Sound on/off (R/W)",
    value: "$FF1A",
    alias: "rAUD3ENA",
    //Bit 7   - Sound ON/OFF (1EQUON,0EQUOFF)
  },
  rNR31: {
    description: "Sound length (R/W)",
    value: "$FF1B",
    alias: "rAUD3LEN",
    //Bit 7-0 - Sound length
  },
  rNR32: {
    description: "Select output level",
    value: "$FF1C",
    alias: "rAUD3LEVEL",
    //Bit 6-5 - Select output level
    //          00: 0/1 (mute)
    //          01: 1/1
    //          10: 1/2
    //          11: 1/4
  },
  rNR33: {
    description: "Frequency lo (W)",
    value: "$FF1D",
    alias: "rAUD3LOW",
  },
  rNR34: {
    description: "Frequency hi (W)",
    value: "$FF1E",
    alias: "rAUD3HIGH",
    flags: "rAUD1HIGH",
  },

  rNR41: {
    description: "Sound length (R/W)",
    value: "$FF20",
    alias: "rAUD4LEN",
    //Bit 5-0 - Sound length data (# 0-63)
  },

  rNR42: {
    description: "Envelope (R/W)",
    value: "$FF21",
    alias: "rAUD4ENV",
    flags: "rAUD1ENV",
  },
  rNR43: {
    description: "Polynomial counter (R/W)",
    value: "$FF22",
    alias: "rAUD4POLY",
    //Bit 7-4 - Selection of the shift clock frequency of the (scf)
    //          polynomial counter (0000-1101)
    //          freqEQUdrf*1/2^scf (not sure)
    //Bit 3 -   Selection of the polynomial counter's step
    //          0: 15 steps
    //          1: 7 steps
    //Bit 2-0 - Selection of the dividing ratio of frequencies (drf)
    //          000: f/4   001: f/8   010: f/16  011: f/24
    //          100: f/32  101: f/40  110: f/48  111: f/56  (fEQU4.194304 Mhz)
  },

  rNR44: {
    description: "",
    value: "$FF23",
    alias: "rAUD4GO",
    //Bit 7 -   Inital
    //Bit 6 -   Counter/consecutive selection
  },

  rPCM12: {
    description: "Sound channel 1&2 PCM amplitude (R) GBC Only!",
    value: "$FF76",
    //Bit 7-4 - Copy of sound channel 2's PCM amplitude
    //Bit 3-0 - Copy of sound channel 1's PCM amplitude
  },
  rPCM34: {
    description: "Sound channel 3&4 PCM amplitude (R) GBC Only!",
    value: "$FF77",
    //Bit 7-4 - Copy of sound channel 4's PCM amplitude
    //Bit 3-0 - Copy of sound channel 3's PCM amplitude
  },

  //Cart related
  CART_COMPATIBLE_DMG: {
    description: "Store at $0143 to indicate DMG cartridge. ($00)",
  },
  CART_COMPATIBLE_DMG_GBC: {
    description:
      "Store at $0143 to indicate DMG and GBC compatible cartridge. ($80)",
  },
  CART_COMPATIBLE_GBC: {
    description: "Store at $0143 to indicate GBC compatible cartridge. ($C0)",
  },

  CART_ROM: { description: "Store at $0147 to cart type. ($00)" },
  CART_ROM_MBC1: { description: "Store at $0147 to cart type. ($01)" },
  CART_ROM_MBC1_RAM: { description: "Store at $0147 to cart type. ($02)" },
  CART_ROM_MBC1_RAM_BAT: { description: "Store at $0147 to cart type. ($03)" },
  CART_ROM_MBC2: { description: "Store at $0147 to cart type. ($05)" },
  CART_ROM_MBC2_BAT: { description: "Store at $0147 to cart type. ($06)" },
  CART_ROM_RAM: { description: "Store at $0147 to cart type. ($08)" },
  CART_ROM_RAM_BAT: { description: "Store at $0147 to cart type. ($09)" },
  CART_ROM_MBC3_BAT_RTC: { description: "Store at $0147 to cart type. ($0F)" },
  CART_ROM_MBC3_RAM_BAT_RTC: {
    description: "Store at $0147 to cart type. ($10)",
  },
  CART_ROM_MBC3: { description: "Store at $0147 to cart type. ($11)" },
  CART_ROM_MBC3_RAM: { description: "Store at $0147 to cart type. ($12)" },
  CART_ROM_MBC3_RAM_BAT: { description: "Store at $0147 to cart type. ($13)" },
  CART_ROM_MBC5: { description: "Store at $0147 to cart type. ($19)" },
  CART_ROM_MBC5_BAT: { description: "Store at $0147 to cart type. ($1A)" },
  CART_ROM_MBC5_RAM_BAT: { description: "Store at $0147 to cart type. ($1B)" },
  CART_ROM_MBC5_RUMBLE: { description: "Store at $0147 to cart type. ($1C)" },
  CART_ROM_MBC5_RAM_RUMBLE: {
    description: "Store at $0147 to cart type. ($1D)",
  },
  CART_ROM_MBC5_RAM_BAT_RUMBLE: {
    description: "Store at $0147 to cart type. ($1E)",
  },
  CART_ROM_MBC7_RAM_BAT_GYRO: {
    description: "Store at $0147 to cart type. ($22)",
  },
  CART_ROM_POCKET_CAMERA: { description: "Store at $0147 to cart type. ($FC)" },

  CART_ROM_256K: {
    description: "Store at $0148 to indicate the number of ROM banks: 2 banks",
  },
  CART_ROM_512K: {
    description: "Store at $0148 to indicate the number of ROM banks: 4 banks",
  },
  CART_ROM_1M: {
    description: "Store at $0148 to indicate the number of ROM banks: 8 banks",
  },
  CART_ROM_2M: {
    description: "Store at $0148 to indicate the number of ROM banks: 16 banks",
  },
  CART_ROM_4M: {
    description: "Store at $0148 to indicate the number of ROM banks: 32 banks",
  },
  CART_ROM_8M: {
    description: "Store at $0148 to indicate the number of ROM banks: 64 banks",
  },
  CART_ROM_16M: {
    description:
      "Store at $0148 to indicate the number of ROM banks: 128 banks",
  },
  CART_ROM_32M: {
    description:
      "Store at $0148 to indicate the number of ROM banks: 256 banks",
  },
  CART_ROM_64M: {
    description:
      "Store at $0148 to indicate the number of ROM banks: 512 banks",
  },

  CART_RAM_NONE: {
    description: "Store at $0149 to indicate the amount of SRAM: No SRAM",
  },
  CART_RAM_16K: {
    description:
      "Store at $0149 to indicate the amount of SRAM: 2 KiloByte, 1 bank",
  },
  CART_RAM_64K: {
    description:
      "Store at $0149 to indicate the amount of SRAM: 8 KiloByte, 1 bank",
  },
  CART_RAM_256K: {
    description:
      "Store at $0149 to indicate the amount of SRAM: 32 KiloByte, 4 banks",
  },
  CART_RAM_1M: {
    description:
      "Store at $0149 to indicate the amount of SRAM: 128 KiloByte, 16 banks",
  },

  CART_RAM_ENABLE: {
    description: "Write this value to $0000 to enable SRAM. ($0A)",
  },
  CART_RAM_DISABLE: {
    description: "Write this value to $0000 to disable SRAM. ($00)",
  },

  //Keypad related
  PADF_DOWN: { description: "$80" },
  PADF_UP: { description: "$40" },
  PADF_LEFT: { description: "$20" },
  PADF_RIGHT: { description: "$10" },
  PADF_START: { description: "$08" },
  PADF_SELECT: { description: "$04" },
  PADF_B: { description: "$02" },
  PADF_A: { description: "$01" },

  PADB_DOWN: { description: "$7" },
  PADB_UP: { description: "$6" },
  PADB_LEFT: { description: "$5" },
  PADB_RIGHT: { description: "$4" },
  PADB_START: { description: "$3" },
  PADB_SELECT: { description: "$2" },
  PADB_B: { description: "$1" },
  PADB_A: { description: "$0" },

  //Screen related
  SCRN_X: {
    description: "Width of screen in pixels",
    value: "160",
  },
  SCRN_Y: {
    description: "Height of screen in pixels",
    value: "144",
  },
  SCRN_X_B: {
    description: "Width of screen in bytes",
    value: "20",
  },
  SCRN_Y_B: {
    description: "Height of screen in bytes",
    value: "18",
  },

  SCRN_VX: {
    description: "Virtual width of screen in pixels",
    value: "256",
  },
  SCRN_VY: {
    description: "Virtual height of screen in pixels",
    value: "256",
  },
  SCRN_VX_B: {
    description: "Virtual width of screen in bytes",
    value: "32",
  },
  SCRN_VY_B: {
    description: "Virtual height of screen in bytes",
    value: "32",
  },
};

for (var key in gameboy_hardware_constants) {
  if (typeof gameboy_hardware_constants[key].flags == "string")
    gameboy_hardware_constants[key].flags =
      gameboy_hardware_constants[gameboy_hardware_constants[key].flags].flags;
  if (gameboy_hardware_constants[key].flags) {
    for (var flag in gameboy_hardware_constants[key].flags)
      gameboy_hardware_constants[flag] =
        gameboy_hardware_constants[key].flags[flag];
  }
  if (gameboy_hardware_constants[key].alias) {
    gameboy_hardware_constants[gameboy_hardware_constants[key].alias] =
      Object.assign({}, gameboy_hardware_constants[key]);
    gameboy_hardware_constants[gameboy_hardware_constants[key].alias].alias =
      key;
  }
}

export { gameboy_hardware_constants };
