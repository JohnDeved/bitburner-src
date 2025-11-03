import type { SaveData } from "./types";
export declare function load(): Promise<SaveData>;
export declare function save(saveData: SaveData): Promise<void>;
export declare function deleteGame(): Promise<void>;
