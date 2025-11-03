import type { PromisePair } from "../Types/Promises";
import type { BlackOperation, Contract, GeneralAction, Operation } from "./Actions";
import type { Action, ActionIdFor, ActionIdentifier, Attempt } from "./Types";
import type { Person } from "../PersonObjects/Person";
import type { Skills as PersonSkills } from "../PersonObjects/Skills";
import { BladeburnerActionType, BladeburnerContractName, BladeburnerMultName, BladeburnerOperationName, BladeburnerSkillName, CityName } from "@enums";
import { IReviverValue } from "../utils/JSONReviver";
import { City } from "./City";
import { getRandomIntInclusive } from "../utils/helpers/getRandomIntInclusive";
import { WorkStats } from "../Work/WorkStats";
import { PartialRecord } from "../Types/Record";
import { type OperationTeam } from "./Actions/TeamCasualties";
export declare const BladeburnerPromise: PromisePair<number>;
export declare class Bladeburner implements OperationTeam {
    numHosp: number;
    moneyLost: number;
    rank: number;
    maxRank: number;
    skillPoints: number;
    totalSkillPoints: number;
    teamSize: number;
    get sleeveSize(): any;
    teamLost: number;
    storedCycles: number;
    randomEventCounter: number;
    actionTimeToComplete: number;
    actionTimeCurrent: number;
    actionTimeOverflow: number;
    action: ActionIdentifier | null;
    cities: Record<string, City>;
    city: any;
    skills: PartialRecord<BladeburnerSkillName, number>;
    skillMultipliers: PartialRecord<BladeburnerMultName, number>;
    staminaBonus: number;
    maxStamina: number;
    stamina: number;
    contracts: Record<BladeburnerContractName, Contract>;
    operations: Record<BladeburnerOperationName, Operation>;
    numBlackOpsComplete: number;
    logging: {
        general: boolean;
        contracts: boolean;
        ops: boolean;
        blackops: boolean;
        events: boolean;
    };
    automateEnabled: boolean;
    automateActionHigh: ActionIdentifier | null;
    automateThreshHigh: number;
    automateActionLow: ActionIdentifier | null;
    automateThreshLow: number;
    consoleHistory: string[];
    consoleLogs: string[];
    getTeamCasualtiesRoll: typeof getRandomIntInclusive;
    constructor();
    init(): void;
    getCurrentCity(): City;
    calculateStaminaPenalty(): number;
    /** This function is for the player. Sleeves use their own functions to perform blade work.
     * Note that this function does not ensure the action is valid, that should be checked before starting */
    startAction(actionId: ActionIdentifier | null): Attempt<{
        message: string;
    }>;
    /** Directly sets a skill level, with no validation */
    setSkillLevel(skillName: BladeburnerSkillName, value: number): void;
    /** Attempts to perform a skill upgrade, gives a message on both success and failure */
    upgradeSkill(skillName: BladeburnerSkillName, count?: number): Attempt<{
        message: string;
    }>;
    executeConsoleCommands(commands: string): void;
    postToConsole(input: string, saveToLogs?: boolean): void;
    log(input: string): void;
    resetAction(): void;
    clearConsole(): void;
    prestigeAugmentation(): void;
    joinFaction(): Attempt<{
        message: string;
    }>;
    storeCycles(numCycles?: number): void;
    executeStartConsoleCommand(args: string[]): void;
    getSkillMultsDisplay(): string[];
    executeSkillConsoleCommand(args: string[]): void;
    executeLogConsoleCommand(args: string[]): void;
    executeHelpConsoleCommand(args: string[]): void;
    executeAutomateConsoleCommand(args: string[]): void;
    executeConsoleCommand(command: string): void;
    triggerMigration(sourceCityName: CityName): void;
    triggerPotentialMigration(sourceCityName: CityName, chance: number): void;
    randomEvent(): void;
    /**
     * Return stat to be gained from Contracts, Operations, and Black Operations
     * @param action(Action obj) - Derived action class
     * @param success(bool) - Whether action was successful
     */
    getActionStats(action: Action, person: Person, success: boolean): WorkStats;
    getDiplomacyPercentage(person: Person): number;
    sleeveSupport(joining: boolean): void;
    getSkillMult(name: BladeburnerMultName): number;
    getEffectiveSkillLevel(person: Person, name: keyof PersonSkills): number;
    updateSkillMultipliers(): void;
    killRandomSupportingSleeves(n: number): void;
    completeOperation(success: boolean): void;
    completeContract(success: boolean, action: Contract): void;
    completeAction(person: Person, actionIdent: ActionIdentifier, isPlayer?: boolean): WorkStats;
    infiltrateSynthoidCommunities(): void;
    changeRank(person: Person, change: number): void;
    processAction(seconds: number): void;
    calculateStaminaGainPerSecond(): number;
    calculateMaxStamina(): void;
    getSkillLevel(skillName: BladeburnerSkillName): number;
    process(): void;
    /** Return the action based on an ActionIdentifier, discriminating types when possible */
    getActionObject(actionId: ActionIdFor<BlackOperation>): BlackOperation;
    getActionObject(actionId: ActionIdFor<Operation>): Operation;
    getActionObject(actionId: ActionIdFor<Contract>): Contract;
    getActionObject(actionId: ActionIdFor<GeneralAction>): GeneralAction;
    getActionObject(actionId: ActionIdentifier): Action;
    getActionFromTypeAndName(type: BladeburnerActionType, name: string): Action | undefined;
    /** Fuzzy matching for action identifiers. Do not use this function for anything except BB console. */
    guessActionFromTypeAndName(type: string, name: string): Action | null;
    static keysToSave: readonly (keyof Bladeburner)[];
    static keysToLoad: readonly (keyof Bladeburner)[];
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a Bladeburner object from a JSON save state. */
    static fromJSON(value: IReviverValue): Bladeburner;
}
