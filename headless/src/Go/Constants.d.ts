import type { OpponentStats, SimpleBoard } from "./Types";
import { GoOpponent } from "@enums";
export declare const opponentDetails: {
    [GoOpponent.none]: {
        komi: number;
        description: string;
        flavorText: string;
        bonusDescription: string;
        bonusPower: number;
    };
    [GoOpponent.Netburners]: {
        komi: number;
        description: string;
        flavorText: string;
        bonusDescription: string;
        bonusPower: number;
    };
    [GoOpponent.SlumSnakes]: {
        komi: number;
        description: string;
        flavorText: string;
        bonusDescription: string;
        bonusPower: number;
    };
    [GoOpponent.TheBlackHand]: {
        komi: number;
        description: string;
        flavorText: string;
        bonusDescription: string;
        bonusPower: number;
    };
    [GoOpponent.Tetrads]: {
        komi: number;
        description: string;
        flavorText: string;
        bonusDescription: string;
        bonusPower: number;
    };
    [GoOpponent.Daedalus]: {
        komi: number;
        description: string;
        flavorText: string;
        bonusDescription: string;
        bonusPower: number;
    };
    [GoOpponent.Illuminati]: {
        komi: number;
        description: string;
        flavorText: string;
        bonusDescription: string;
        bonusPower: number;
    };
    [GoOpponent.w0r1d_d43m0n]: {
        komi: number;
        description: string;
        flavorText: string;
        bonusDescription: string;
        bonusPower: number;
    };
};
export declare const boardSizes: number[];
export declare const columnIndexes = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
export declare function newOpponentStats(): OpponentStats;
export declare const bitverseBoardShape: SimpleBoard;
