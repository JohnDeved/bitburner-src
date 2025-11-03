"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = load;
exports.save = save;
exports.deleteGame = deleteGame;
function getDB() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject("Indexed DB does not exists");
        }
        /**
         * DB is called bitburnerSave
         * Object store is called savestring
         * key for the Object store is called save
         * Version `1` is important
         */
        const indexedDbRequest = window.indexedDB.open("bitburnerSave", 1);
        // This is called when there's no db to begin with. It's important, don't remove it.
        indexedDbRequest.onupgradeneeded = function () {
            const db = this.result;
            db.createObjectStore("savestring");
        };
        indexedDbRequest.onerror = function () {
            reject(new Error("Failed to get IDB", { cause: this.error }));
        };
        indexedDbRequest.onsuccess = function () {
            const db = this.result;
            if (!db) {
                reject(new Error("database loading result was undefined"));
                return;
            }
            resolve(db.transaction(["savestring"], "readwrite").objectStore("savestring"));
        };
    });
}
function load() {
    return getDB().then((db) => {
        return new Promise((resolve, reject) => {
            const request = db.get("save");
            request.onerror = function () {
                reject(new Error("Error in Database request to get save data", { cause: this.error }));
            };
            request.onsuccess = function () {
                resolve(this.result);
            };
        });
    });
}
function save(saveData) {
    return getDB().then((db) => {
        return new Promise((resolve, reject) => {
            // We'll save to IndexedDB
            const request = db.put(saveData, "save");
            request.onerror = function () {
                reject(new Error("Error saving game to IndexedDB", { cause: this.error }));
            };
            request.onsuccess = () => resolve();
        });
    });
}
function deleteGame() {
    return getDB().then((db) => {
        db.delete("save");
    });
}
