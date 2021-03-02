"use strict";

this.gfxEditor = new Object();
(function(editor) {
    var colors = [0xFFC2F0C4, 0xFFA8B95A, 0xFF6E601E, 0xFF001B2D]

    var current_file;
    var current_tile_index;
    var main_div;
    var tile_canvas;
    var draw_canvas;
    var palette_canvas;
    var selected_color = 0;

    editor.register = function(div_id)
    {
        main_div = document.getElementById(div_id);
        tile_canvas = document.getElementById("gfxEditorTilesCanvas");
        draw_canvas = document.getElementById("gfxEditorDrawCanvas");
        palette_canvas = document.getElementById("gfxEditorPalette");
        new ResizeObserver(function()
        {
            tile_canvas.parentElement.style.maxWidth = main_div.clientWidth;
            tile_canvas.parentElement.style.maxHeight = main_div.clientHeight - 300;
            tile_canvas.parentElement.style.display = "";
        }).observe(main_div);

        draw_canvas.onmousemove = function(e) {
            var rect = e.target.getBoundingClientRect();
            var x = ~~((e.clientX - rect.left) / rect.width * e.target.width);
            var y = ~~((e.clientY - rect.top) / rect.height * e.target.height);
            e.preventDefault();
            if (e.buttons == 0) return;

            drawPixel(x, y, selected_color);
        }
        draw_canvas.onmousedown = draw_canvas.onmousemove;
        draw_canvas.oncontextmenu = function() { return false; }
        palette_canvas.onmousedown = function(e) {
            var rect = e.target.getBoundingClientRect();
            var x = ~~((e.clientX - rect.left) / rect.width * e.target.width / 16);
            var y = ~~((e.clientY - rect.top) / rect.height * e.target.height / 16);
            e.preventDefault();
            selected_color = y;
            updatePalette();
        }
        updatePalette();

        tile_canvas.onmousedown = function(e) {
            var rect = e.target.getBoundingClientRect();
            var x = ~~((e.clientX - rect.left) / rect.width * e.target.width / 8);
            var y = ~~((e.clientY - rect.top) / rect.height * e.target.height / 8);
            e.preventDefault();
            editor.setTileIndex(x + y * 16);
        }
    }

    editor.setCurrentFile = function(filename)
    {
        current_file = filename;
        this.setTileIndex(0);
        
        var data = storage.getFiles()[filename];
        var tile_count = ~~(data.length / 16);
        var row_count = ~~((tile_count + 15) / 16);
        tile_canvas.width = 16 * 8;
        tile_canvas.height = row_count * 8;
        
        tile_canvas.style.width = tile_canvas.width * 4;
        
        var ctx = tile_canvas.getContext('2d');
        var image_data = ctx.getImageData(0, 0, tile_canvas.width, tile_canvas.height);
        var pixels = new Uint32Array(image_data.data.buffer);
        var pitch = tile_canvas.width;
        for(var n=0; n<tile_count; n++)
        {
            var col = n % 16;
            var row = ~~(n / 16);
            var pixel_index = col * 8 + row * 8 * pitch;

            decodeTile(new Uint8Array(data.buffer, n*16, 16), pixels, pixel_index, pitch)
        }
        ctx.putImageData(image_data, 0, 0);
    }
    
    editor.hide = function()
    {
        main_div.style.display = "none"
    }
    
    editor.show = function()
    {
        main_div.style.display = ""
    }

    editor.setTileIndex = function(index)
    {
        var data = storage.getFiles()[current_file];
        if (index >= data.length / 16)
            index = data.length / 16 - 1;
        current_tile_index = index;

        var ctx = draw_canvas.getContext('2d');
        var image_data = ctx.getImageData(0, 0, draw_canvas.width, draw_canvas.height);
        var pixels = new Uint32Array(image_data.data.buffer);
        decodeTile(new Uint8Array(data.buffer, index * 16, 16), pixels, 0, 8);
        ctx.putImageData(image_data, 0, 0);
    }

    function decodeTile(data, pixels, pixel_index, pitch)
    {
        for(var y=0; y<8; y++)
        {
            var a = data[y * 2];
            var b = data[y * 2 + 1];
            for(var x=0; x<8; x++)
            {
                var c = 0;
                if (a & (0x80 >> x))
                    c |= 1;
                if (b & (0x80 >> x))
                    c |= 2;
                pixels[pixel_index + x + y * pitch] = colors[c];
            }
        }
    }

    function drawPixel(x, y, color)
    {
        var data = storage.getFiles()[current_file];
        if (color & 1)
            data[current_tile_index * 16 + y * 2+0] |= (0x80 >> x);
        else
            data[current_tile_index * 16 + y * 2+0] &=~(0x80 >> x);
        if (color & 2)
            data[current_tile_index * 16 + y * 2+1] |= (0x80 >> x);
        else
            data[current_tile_index * 16 + y * 2+1] &=~(0x80 >> x);
        editor.setTileIndex(current_tile_index);

        storage.update(current_file, data);

        // Update the tile in the tile list
        var ctx = tile_canvas.getContext('2d');
        var image_data = ctx.getImageData(0, 0, tile_canvas.width, tile_canvas.height);
        var pixels = new Uint32Array(image_data.data.buffer);
        var pitch = tile_canvas.width;
        var col = current_tile_index % 16;
        var row = ~~(current_tile_index / 16);
        var pixel_index = col * 8 + row * 8 * pitch;
        decodeTile(new Uint8Array(data.buffer, current_tile_index*16, 16), pixels, pixel_index, pitch)
        ctx.putImageData(image_data, 0, 0);
    }

    function updatePalette()
    {
        var ctx = palette_canvas.getContext('2d');
        for(var n=0; n<4; n++)
        {
            ctx.fillStyle = "rgb(" + (colors[n] & 0xFF) + ", " + ((colors[n] >> 8) & 0xFF) + ", " + ((colors[n] >> 16) & 0xFF) +")";
            ctx.fillRect(0,  n * 16, 16, 16);
        }

        ctx.strokeStyle = '#FFF';
        ctx.beginPath();
        ctx.rect(2.5, selected_color * 16 + 2.5, 11, 11);
        ctx.stroke();
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.rect(1.5, selected_color * 16 + 1.5, 13, 13);
        ctx.stroke();
    }
})(this.gfxEditor);
