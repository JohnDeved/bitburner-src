"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentFile = void 0;
exports.allContentFiles = allContentFiles;
const FileMetadata_1 = require("./FileMetadata");
class ContentFile {
    constructor() {
        this.metadata = new FileMetadata_1.FileMetadata();
    }
}
exports.ContentFile = ContentFile;
/** Generator function to allow iterating through all content files on a server */
function* allContentFiles(server) {
    yield* server.scripts;
    yield* server.textFiles;
}
