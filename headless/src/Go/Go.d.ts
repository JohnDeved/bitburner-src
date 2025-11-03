import type { BoardState, OpponentStats } from "./Types";
import type { GoOpponent } from "@enums";
import { PartialRecord } from "../Types/Record";
import { EventEmitter } from "../utils/EventEmitter";
export declare const getEmptyHighlightedPoints: (size?: number) => any[][];
export declare class GoObject {
    previousGame: BoardState | null;
    currentGame: BoardState;
    stats: PartialRecord<GoOpponent, OpponentStats>;
    storedCycles: number;
    moveOrCheatViaApi: boolean;
    prestigeAugmentation(): void;
    prestigeSourceFile(): void;
    /**
     * Stores offline time that is consumed to speed up the AI.
     * Only stores offline time if the player has actually been using the mechanic.
     */
    storeCycles(offlineCycles: number): void;
}
export declare const Go: GoObject;
/** Event emitter to allow the UI to subscribe to Go gameplay updates in order to trigger rerenders properly */
export declare const GoEvents: EventEmitter<any[]>;
