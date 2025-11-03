"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileMetadata = void 0;
const JSONReviver_1 = require("../utils/JSONReviver");
class FileMetadata {
    /** Create a FileMetadata with everything set to the current time */
    constructor() {
        const now = Date.now();
        this.atime = now;
        this.mtime = now;
        this.btime = now;
    }
    /** Change metadata to reflect a read just happened */
    read() {
        this.atime = Date.now();
    }
    /** Change metadata to reflect a write just happened */
    edit() {
        this.mtime = Date.now();
    }
    /** Get a plain version of this object */
    plain() {
        return {
            atime: this.atime,
            mtime: this.mtime,
            btime: this.btime,
        };
    }
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("FileMetadata", this);
    }
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(FileMetadata, value.data);
    }
}
exports.FileMetadata = FileMetadata;
JSONReviver_1.constructorsForReviver.FileMetadata = FileMetadata;
