import { CreatingCorporationCheckResult } from "@nsdefs";
import { PositiveInteger } from "../types";
import { Corporation } from "./Corporation";
import { CorpUpgrade } from "./data/CorporationUpgrades";
export declare function convertCreatingCorporationCheckResultToMessage(checkResult: CreatingCorporationCheckResult): string;
export declare function canCreateCorporation(selfFund: boolean, restart: boolean): CreatingCorporationCheckResult;
export declare function costOfCreatingCorporation(restart: boolean): number;
export declare function calculateUpgradeCost(basePrice: number, priceMult: number, fromLevel: number, amount: PositiveInteger): number;
export declare function calculateOfficeSizeUpgradeCost(currentSize: number, sizeIncrease: PositiveInteger): number;
export declare function calculateMaxAffordableUpgrade(corp: Corporation, upgrade: CorpUpgrade): 0 | PositiveInteger;
/** Returns a string representing the reason a share sale should fail, or empty string if there is no issue. */
export declare function sellSharesFailureReason(corp: Corporation, numShares: number): string;
/** Returns a string representing the reason a share buyback should fail, or empty string if there is no issue. */
export declare function buybackSharesFailureReason(corp: Corporation, numShares: number): string;
/** Returns a string representing the reason issuing new shares should fail, or empty string if there is no issue. */
export declare function issueNewSharesFailureReason(corp: Corporation, numShares: number): string;
export declare function calculateMarkupMultiplier(sellingPrice: number, marketPrice: number, markupLimit: number): number;
