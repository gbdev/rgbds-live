"use strict";

this.gfxEditor = new Object();
(function(editor) {
    var current_file;
    var main_div;
    var tile_canvas;
    
    editor.register = function(div_id)
    {
        main_div = document.getElementById(div_id);
        tile_canvas = document.getElementById("gfxEditorTilesCanvas");
        new ResizeObserver(function()
        {
            tile_canvas.parentElement.style.maxWidth = main_div.clientWidth;
            tile_canvas.parentElement.style.maxHeight = main_div.clientHeight - 300;
            tile_canvas.parentElement.style.display = "";
        }).observe(main_div);
    }

    editor.setCurrentFile = function(filename)
    {
        current_file = filename;
        
        var data = storage.getFiles()[filename];
        var tile_count = ~~(data.length / 16);
        var row_count = ~~((tile_count + 15) / 16);
        tile_canvas.width = 16 * 8;
        tile_canvas.height = row_count * 8;
        
        tile_canvas.style.width = tile_canvas.width * 4;
        
        var ctx = tile_canvas.getContext('2d');
        var image_data = ctx.getImageData(0, 0, tile_canvas.width, tile_canvas.height);
        var pixels = new Uint32Array(image_data.data.buffer);
        var colors = [0xFFC2F0C4, 0xFFA8B95A, 0xFF6E601E, 0xFF001B2D]
        for(var n=0; n<tile_count; n++)
        {
            var col = n % 16;
            var row = ~~(n / 16);
            var pixel_index = col * 8 + row * 8 * 16 * 8;
            for(var y=0; y<8; y++)
            {
                var a = data[n * 16 + y * 2];
                var b = data[n * 16 + y * 2 + 1];
                for(var x=0; x<8; x++)
                {
                    var c = 0;
                    if (a & (0x80 >> x))
                        c |= 1;
                    if (b & (0x80 >> x))
                        c |= 2;
                    pixels[pixel_index + x + y * 16 * 8] = colors[c];
                }
            }
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
})(this.gfxEditor);
