import type { Person as IPerson, WorkStats } from "@nsdefs";
import type { PlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import type { IReviverValue } from "../utils/JSONReviver";
import type { MoneySource } from "../utils/MoneySourceTracker";
import type { HP } from "./HP";
import type { Skills } from "./Skills";
import { CityName } from "@enums";
import { calculateSkill } from "./formulas/skill";
export declare abstract class Person implements IPerson {
    hp: HP;
    skills: Skills;
    exp: Skills;
    mults: import("./Multipliers").Multipliers;
    /** Augmentations */
    augmentations: PlayerOwnedAugmentation[];
    queuedAugmentations: PlayerOwnedAugmentation[];
    /** City that the person is in */
    city: CityName;
    gainHackingExp(exp: number): void;
    gainStrengthExp(exp: number): void;
    gainDefenseExp(exp: number): void;
    gainDexterityExp(exp: number): void;
    gainAgilityExp(exp: number): void;
    gainCharismaExp(exp: number): void;
    gainIntelligenceExp(exp: number): void;
    gainStats(retValue: WorkStats): void;
    regenerateHp(amt: number): void;
    updateSkillLevels(this: Person): void;
    hasAugmentation(augName: string, ignoreQueued?: boolean): boolean;
    travel(cityName: CityName): boolean;
    calculateSkill: typeof calculateSkill;
    /** Reset all multipliers to 1 */
    resetMultipliers(): void;
    abstract travelCostMoneySource(): MoneySource;
    abstract takeDamage(amt: number): boolean;
    abstract whoAmI(): string;
    abstract toJSON(): IReviverValue;
}
