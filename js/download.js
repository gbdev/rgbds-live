"use strict";

function downloadBlob(blob, filename)
{
    var element = document.createElement('a');
    var url = window.URL.createObjectURL(blob, {type: 'application/octet-stream'});
    element.setAttribute('href', url);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    window.URL.revokeObjectURL(url);
}
