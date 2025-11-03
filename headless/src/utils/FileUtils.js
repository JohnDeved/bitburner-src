"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadContentAsFile = downloadContentAsFile;
function downloadContentAsFile(content, filename) {
    const blob = new Blob([content]);
    const anchorElement = document.createElement("a");
    const url = URL.createObjectURL(blob);
    anchorElement.href = url;
    anchorElement.download = filename;
    anchorElement.click();
    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 0);
}
