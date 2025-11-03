"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidSaveData = exports.UnsupportedSaveData = exports.SaveDataError = void 0;
exports.canUseBinaryFormat = canUseBinaryFormat;
exports.encodeJsonSaveString = encodeJsonSaveString;
exports.decodeSaveData = decodeSaveData;
class SaveDataError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.SaveDataError = SaveDataError;
class UnsupportedSaveData extends SaveDataError {
}
exports.UnsupportedSaveData = UnsupportedSaveData;
class InvalidSaveData extends SaveDataError {
}
exports.InvalidSaveData = InvalidSaveData;
function canUseBinaryFormat() {
    return "CompressionStream" in globalThis;
}
async function compress(dataString) {
    const compressedReadableStream = new Blob([dataString]).stream().pipeThrough(new CompressionStream("gzip"));
    return new Uint8Array(await new Response(compressedReadableStream).arrayBuffer());
}
async function decompress(binaryData) {
    const decompressedReadableStream = new Blob([binaryData]).stream().pipeThrough(new DecompressionStream("gzip"));
    const reader = decompressedReadableStream.pipeThrough(new TextDecoderStream("utf-8", { fatal: true })).getReader();
    let result = "";
    try {
        for (let { value, done } = await reader.read(); !done; { value, done } = await reader.read()) {
            result += value;
        }
    }
    catch (error) {
        throw new InvalidSaveData(String(error));
    }
    return result;
}
async function encodeJsonSaveString(jsonSaveString) {
    // Fallback to the base64 format if player's browser does not support Compression Streams API.
    if (canUseBinaryFormat()) {
        return await compress(jsonSaveString);
    }
    else {
        // The unescape(encodeURIComponent()) pair encodes jsonSaveString into a "binary string" suitable for btoa, despite
        // seeming like a no-op at first glance.
        // Ref: https://stackoverflow.com/a/57713220
        return btoa(unescape(encodeURIComponent(jsonSaveString)));
    }
}
/** Return json save string */
async function decodeSaveData(saveData) {
    if (saveData instanceof Uint8Array) {
        if (!canUseBinaryFormat()) {
            throw new UnsupportedSaveData("Your browser does not support Compression Streams API");
        }
        return await decompress(saveData);
    }
    else {
        return decodeURIComponent(escape(atob(saveData)));
    }
}
