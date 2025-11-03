import type { OpponentStats, SimpleBoard } from "./Types";
import type { PartialRecord } from "../Types/Record";
import { GoColor, GoOpponent } from "@enums";
type PreviousGameSaveData = {
    ai: GoOpponent;
    board: SimpleBoard;
    previousPlayer: GoColor | null;
} | null;
type CurrentGameSaveData = PreviousGameSaveData & {
    previousBoard?: string;
    cheatCount: number;
    cheatCountForWhite: number;
    passCount: number;
};
type SaveFormat = {
    previousGame: PreviousGameSaveData;
    currentGame: CurrentGameSaveData;
    stats: PartialRecord<GoOpponent, OpponentStats>;
    storedCycles: number;
    moveOrCheatViaApi: boolean;
};
export declare function getGoSave(): SaveFormat;
export declare function loadGo(data: unknown): boolean;
export {};
