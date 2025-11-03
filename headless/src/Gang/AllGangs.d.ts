import { FactionName } from "@enums";
interface GangTerritory {
    power: number;
    territory: number;
}
export declare function getDefaultAllGangs(): {
    [FactionName.SlumSnakes]: {
        power: number;
        territory: number;
    };
    [FactionName.Tetrads]: {
        power: number;
        territory: number;
    };
    [FactionName.TheSyndicate]: {
        power: number;
        territory: number;
    };
    [FactionName.TheDarkArmy]: {
        power: number;
        territory: number;
    };
    [FactionName.SpeakersForTheDead]: {
        power: number;
        territory: number;
    };
    [FactionName.NiteSec]: {
        power: number;
        territory: number;
    };
    [FactionName.TheBlackHand]: {
        power: number;
        territory: number;
    };
};
export declare let AllGangs: Record<string, GangTerritory>;
export declare function resetGangs(): void;
export declare function loadAllGangs(saveString: string): void;
export declare function getClashWinChance(thisGang: string, otherGang: string): number;
export {};
