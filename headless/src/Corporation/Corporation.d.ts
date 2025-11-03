import type { PromisePair } from "../Types/Promises";
import { CorpStateName, InvestmentOffer } from "@nsdefs";
import { CorpUnlockName, CorpUpgradeName } from "@enums";
import { CorporationState } from "./CorporationState";
import { FundsSource } from "./data/FundsSource";
import { Division } from "./Division";
import { IReviverValue } from "../utils/JSONReviver";
import { JSONMap, JSONSet } from "../Types/Jsonable";
import { type Result } from "../types";
export declare const CorporationPromise: PromisePair<CorpStateName>;
interface ICorporationParams {
    name?: string;
    seedFunded?: boolean;
    shareSaleCooldown?: number;
}
export declare class Corporation {
    name: string;
    /** Map keyed by division name */
    divisions: JSONMap<string, Division>;
    maxDivisions: number;
    funds: number;
    revenue: number;
    expenses: number;
    fundingRound: number;
    /** Publicly traded */
    public: boolean;
    /** Total existing shares */
    totalShares: number;
    numShares: number;
    shareSalesUntilPriceUpdate: number;
    shareSaleCooldown: number;
    issueNewSharesCooldown: number;
    dividendRate: number;
    tributeModifier: number;
    investorShares: number;
    issuedShares: number;
    sharePrice: number;
    storedCycles: number;
    unlocks: JSONSet<CorpUnlockName>;
    upgrades: Record<string, {
        level: number;
        value: number;
    }>;
    previousTotalAssets: number;
    totalAssets: number;
    cycleValuation: number;
    valuationsList: number[];
    valuation: number;
    seedFunded: boolean;
    state: CorporationState;
    numberOfOfficesAndWarehouses: number;
    constructor(params?: ICorporationParams);
    gainFunds(amt: number, source: FundsSource): void;
    loseFunds(amt: number, source: FundsSource): void;
    getNextState(): CorpStateName;
    storeCycles(numCycles: number): void;
    process(): void;
    getCycleDividends(): number;
    determineCycleValuation(): number;
    determineValuation(): void;
    updateTotalAssets(): void;
    getTargetSharePrice(ceoOwnership?: number | null): number;
    updateSharePrice(): void;
    calculateMaxNewShares(): number;
    calculateShareSale(numShares: number): [profit: number, sharePrice: number, sharesUntilUpdate: number];
    calculateShareBuyback(numShares: number): [cost: number, sharePrice: number, sharesUntilUpdate: number];
    getInvestmentOffer(): InvestmentOffer;
    convertCooldownToString(cd: number): string;
    /**
     * Purchasing a one-time unlock
     */
    purchaseUnlock(unlockName: CorpUnlockName): Result;
    /**
     * Purchasing a levelable upgrade
     */
    purchaseUpgrade(upgradeName: CorpUpgradeName, amount?: number): Result;
    getProductionMultiplier(): number;
    getStorageMultiplier(): number;
    getAdvertisingMultiplier(): number;
    getEmployeeCreMultiplier(): number;
    getEmployeeChaMult(): number;
    getEmployeeIntMult(): number;
    getEmployeeEffMult(): number;
    getSalesMult(): number;
    getScientificResearchMult(): number;
    getStarterGuide(): void;
    static includedProperties: readonly (keyof Corporation)[];
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a Corporation object from a JSON save state. */
    static fromJSON(value: IReviverValue): Corporation;
}
export {};
