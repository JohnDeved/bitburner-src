"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextFile = void 0;
const JSONReviver_1 = require("./utils/JSONReviver");
const ContentFile_1 = require("./Paths/ContentFile");
/** Represents a plain text file that is typically stored on a server. */
class TextFile extends ContentFile_1.ContentFile {
    // Shared interface on Script and TextFile for accessing content
    get content() {
        this.metadata.read();
        return this.text;
    }
    set content(text) {
        this.metadata.edit();
        this.text = text;
    }
    constructor(filename = "default.txt", txt = "") {
        super();
        this.filename = filename;
        this.text = txt;
    }
    /** Serialize the current file to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("TextFile", this);
    }
    deleteFromServer(server) {
        if (!server.textFiles.has(this.filename))
            return false;
        server.textFiles.delete(this.filename);
        return true;
    }
    /** Initializes a TextFile from a JSON save state. */
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(TextFile, value.data);
    }
}
exports.TextFile = TextFile;
JSONReviver_1.constructorsForReviver.TextFile = TextFile;
