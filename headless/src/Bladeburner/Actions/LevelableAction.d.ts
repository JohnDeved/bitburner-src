import type { Bladeburner } from "../Bladeburner";
import type { IReviverValue } from "../../utils/JSONReviver";
import type { Availability } from "../Types";
import { ActionClass, ActionParams } from "./Action";
export type LevelableActionParams = ActionParams & {
    growthFunction: () => number;
    difficultyFac?: number;
    rewardFac?: number;
    minCount?: number;
    maxCount?: number;
};
export declare abstract class LevelableActionClass extends ActionClass {
    difficultyFac: number;
    rewardFac: number;
    growthFunction: () => number;
    minCount: number;
    maxCount: number;
    count: number;
    level: number;
    maxLevel: number;
    autoLevel: boolean;
    successes: number;
    failures: number;
    constructor(params?: LevelableActionParams | null);
    getAvailability(__bladeburner: Bladeburner): Availability;
    setMaxLevel(baseSuccessesPerLevel: number): void;
    getSuccessesNeededForNextLevel(baseSuccessesPerLevel: number): number;
    getDifficulty(): number;
    /** Reset a levelable action's tracked stats */
    reset(): void;
    /** These are not loaded the same way as most game objects, to allow better typechecking on load + partially static loading */
    loadData(loadedObject: LevelableActionClass): void;
    /** Create a basic object just containing the relevant data for a levelable action */
    save<T extends LevelableActionClass>(this: T, ctorName: string, ...extraParams: (keyof T)[]): IReviverValue<LevelableActionSaveData>;
}
export interface LevelableActionSaveData {
    count: number;
    level: number;
    maxLevel: number;
    autoLevel: boolean;
    successes: number;
    failures: number;
}
