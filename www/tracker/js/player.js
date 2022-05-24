"use strict";

class Player {
    interval_handle = null;
    rom_file = null;
    muted_channels_mask = 0;

    constructor()
    {
        compiler.setLogCallback(console.log);
        compiler.setLinkOptions(['-t', '-w']);

        function getFile(url, name)
        {
            var req = new XMLHttpRequest();
            req.open("GET", url, false);
            req.send();
            storage.update(name, req.response.replace(/include\//g, ""));
        }
        getFile("https://raw.githubusercontent.com/untoxa/hUGEBuild/master/player-rgbds/rgbds_player.asm", "main.asm");
        getFile("https://raw.githubusercontent.com/untoxa/hUGEBuild/master/hUGEDriver.asm", "hUGEDriver.asm");
        getFile("https://raw.githubusercontent.com/untoxa/hUGEBuild/master/include/hUGE.inc", "hUGE.inc");
        getFile("https://raw.githubusercontent.com/untoxa/hUGEBuild/master/include/hUGE_note_table.inc", "hUGE_note_table.inc");
        getFile("https://raw.githubusercontent.com/untoxa/hUGEBuild/master/include/hardware.inc", "hardware.inc");
        storage.update("song.asm", "SECTION \"song\", ROM0[$1000]\n_song_descriptor:: ds $8000 - @")
        
        compiler.compile((rom_file, start_address, addr_to_line) => {
            this.rom_file = rom_file;
        });
    }
    
    toggleMute(channel)
    {
        var mask = 1 << channel;
        if (this.muted_channels_mask & mask)
        {
            this.muted_channels_mask &=~mask;
            return false;
        }
        this.muted_channels_mask |= mask;
        emulator.writeMem(0xFF12 + channel * 5, 0)
        return true;
    }
    
    play() {
        this.stop();
        this.updateRom();

        var current_order_addr = compiler.getRamSymbols().findIndex((v) => {return v == "current_order"});
        var row_addr = compiler.getRamSymbols().findIndex((v) => {return v == "row"});
        var mute_addr = compiler.getRamSymbols().findIndex((v) => {return v == "mute_channels"});

        emulator.init(null, this.rom_file);
        this.interval_handle = setInterval(() => {
            emulator.writeMem(mute_addr, this.muted_channels_mask)
            emulator.step("run");

            var current_sequence = emulator.readMem(current_order_addr) / 2;
            if (ui.tracker.getPatternIndex() != song.sequence[current_sequence])
                ui.tracker.loadPattern(song.sequence[current_sequence]);
            ui.sequence.setCurrentSequenceIndex(current_sequence);

            var row = emulator.readMem(row_addr);
            ui.tracker.setSelectedRow(row);
        }, 10);
    }
    
    stop()
    {
        if (this.interval_handle === null)
            return;
        clearInterval(this.interval_handle);
        this.interval_handle = null;
    }
    
    updateRom()
    {
        var addr = compiler.getRomSymbols().indexOf("_song_descriptor");
        var buf = new Uint8Array(this.rom_file.buffer);
        
        buf[addr] = song.ticks_per_row;
        var header_idx = addr + 1;
        addr += 21;

        buf[addr] = song.sequence.length * 2;
        function addAddr(size) {
            buf[header_idx+0] = addr & 0xFF;
            buf[header_idx+1] = addr >> 8;
            header_idx += 2;
            addr += size;
        }
        addAddr(1);

        var orders_addr = []
        for(var n=0; n<4; n++)
        {
            orders_addr.push(addr);
            addAddr(64*2);
        }
        for(var n=0; n<song.duty_instruments.length; n++)
        {
            var instr = song.duty_instruments[n];

            var nr10 = (instr.frequency_sweep_time << 4) | (instr.frequency_sweep_shift < 0 ? 0x08 : 0x00) | Math.abs(instr.frequency_sweep_shift);
            var nr11 = (instr.duty_cycle << 6) | ((instr.length !== null ? 64 - instr.length : 0) & 0x3f);
            var nr12 = (instr.initial_volume << 4) | (instr.volume_sweep_change > 0 ? 0x08 : 0x00);
            if (instr.volume_sweep_change != 0)
                nr12 |= 8 - Math.abs(instr.volume_sweep_change);
            var nr14 = 0x80 | (instr.length !== null ? 0x40 : 0);

            buf[addr + n * 4 + 0] = nr10;
            buf[addr + n * 4 + 1] = nr11;
            buf[addr + n * 4 + 2] = nr12;
            buf[addr + n * 4 + 3] = nr14;
        }
        addAddr(16 * 4);
        for(var n=0; n<song.wave_instruments.length; n++)
        {
            var instr = song.wave_instruments[n];

            var nr31 = (instr.length !== null ? instr.length : 0) & 0xff;
            var nr32 = (instr.volume << 5);
            var wave_nr = instr.wave_index;
            var nr34 = 0x80 | (instr.length !== null ? 0x40 : 0);

            buf[addr + n * 4 + 0] = nr31;
            buf[addr + n * 4 + 1] = nr32;
            buf[addr + n * 4 + 2] = wave_nr;
            buf[addr + n * 4 + 3] = nr34;
        }
        addAddr(16 * 4);
        for(var n=0; n<song.noise_instruments.length; n++)
        {
            var instr = song.noise_instruments[n];

            var param0 = (instr.initial_volume << 4) | (instr.volume_sweep_change > 0 ? 0x08 : 0x00);
            if (instr.volume_sweep_change != 0)
                param0 |= 8 - Math.abs(instr.volume_sweep_change);
            var param1 = (instr.length !== null ? 64 - instr.length : 0) & 0x3f;
            if (instr.length !== null)
                param1 |= 0x40;
            if (instr.bit_count == 7)
                param1 |= 0x80;

            buf[addr + n * 8 + 0] = param0;
            buf[addr + n * 8 + 1] = param1;
            buf[addr + n * 8 + 2] = 0;
            buf[addr + n * 8 + 3] = 0;
            buf[addr + n * 8 + 4] = 0;
            buf[addr + n * 8 + 5] = 0;
            buf[addr + n * 8 + 6] = 0;
            buf[addr + n * 8 + 7] = 0;
        }
        addAddr(16 * 8);
        buf[header_idx+0] = 0;
        buf[header_idx+1] = 0;
        header_idx += 2;
        for(var n=0; n<song.waves.length; n++)
        {
            for(var idx=0; idx<16; idx++)
                buf[addr + n * 16 + idx] = (song.waves[n][idx*2] << 4) | (song.waves[n][idx*2 + 1]);
        }
        addAddr(16 * 16);
        
        for(var track=0; track<4; track++)
        {
            var pattern_addr = []
            for(var n=0; n<song.patterns.length; n++)
            {
                var pattern = song.patterns[n];
                pattern_addr.push(addr);
                
                for(var idx=0; idx<pattern.length; idx++)
                {
                    var cell = pattern[idx][track];
                    buf[addr++] = cell.note !== null ? cell.note : 90;
                    buf[addr++] = ((cell.instrument !== null ? (cell.instrument + 1) : 0) << 4) | (cell.effectcode !== null ? cell.effectcode : 0);
                    buf[addr++] = cell.effectparam !== null ? cell.effectparam : 0;
                }
            }
            
            var order_addr = orders_addr[track];
            for(var n=0;n<song.sequence.length; n++)
            {
                buf[order_addr++] = pattern_addr[song.sequence[n]] & 0xFF;
                buf[order_addr++] = pattern_addr[song.sequence[n]] >> 8;
            }
        }
        console.log(addr - compiler.getRomSymbols().indexOf("_song_descriptor"));
        
        emulator.updateRom(this.rom_file);
    }
};
