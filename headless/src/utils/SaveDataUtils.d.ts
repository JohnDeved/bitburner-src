import { SaveData } from "../types";
export declare abstract class SaveDataError extends Error {
    constructor(message: string);
}
export declare class UnsupportedSaveData extends SaveDataError {
}
export declare class InvalidSaveData extends SaveDataError {
}
export declare function canUseBinaryFormat(): boolean;
export declare function encodeJsonSaveString(jsonSaveString: string): Promise<SaveData>;
/** Return json save string */
export declare function decodeSaveData(saveData: SaveData): Promise<string>;
