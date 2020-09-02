"use strict";

class Player {
    constructor()
    {
        this.interval_handle = null;
    
        compiler.setLogCallback(console.log);
        compiler.setLinkOptions(['-t', '-w']);
        function getFile(url, name)
        {
            var req = new XMLHttpRequest();
            req.open("GET", url, false);
            req.send();
            storage.update(name, req.response.replace(/include\//g, ""));
        }
        getFile("https://raw.githubusercontent.com/untoxa/hUGEBuild/master/player-rgbds/rgbds_player.z80", "main.asm");
        getFile("https://raw.githubusercontent.com/untoxa/hUGEBuild/master/driver_lite.z80", "driver_lite.asm");
        getFile("https://raw.githubusercontent.com/untoxa/hUGEBuild/master/include/constants.inc", "constants.inc");
        getFile("https://raw.githubusercontent.com/untoxa/hUGEBuild/master/include/music.inc", "music.inc");
    }
    
    play() {
        this.stop();

        storage.update("song.asm", exportSongAsAssembly(song));

        compiler.compile((rom_file, start_address, addr_to_line) => {
            var current_order_addr = compiler.getRamSymbols().findIndex((v) => {return v == "current_order"});
            var row_addr = compiler.getRamSymbols().findIndex((v) => {return v == "row"});

            emulator.init(null, rom_file);
            this.interval_handle = setInterval(() => {
                emulator.step("run");

                var current_sequence = emulator.readMem(current_order_addr) / 2;
                if (ui.tracker.getPatternIndex() != song.sequence[current_sequence])
                    ui.tracker.loadPattern(song.sequence[current_sequence]);
                ui.sequence.setCurrentSequenceIndex(current_sequence);

                var row = emulator.readMem(row_addr);
                ui.tracker.setSelectedRow(row);
            }, 10);
        });
    }
    
    stop()
    {
        if (this.interval_handle === null)
            return;
        clearInterval(this.interval_handle);
        this.interval_handle = null;
    }
};