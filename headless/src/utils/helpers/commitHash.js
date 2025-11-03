"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitHash = commitHash;
function commitHash() {
    try {
        return __COMMIT_HASH__ ?? "DEV";
    }
    catch {
        return "DEV";
    }
}
