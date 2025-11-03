"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCreatingCorporationCheckResultToMessage = convertCreatingCorporationCheckResultToMessage;
exports.canCreateCorporation = canCreateCorporation;
exports.costOfCreatingCorporation = costOfCreatingCorporation;
exports.calculateUpgradeCost = calculateUpgradeCost;
exports.calculateOfficeSizeUpgradeCost = calculateOfficeSizeUpgradeCost;
exports.calculateMaxAffordableUpgrade = calculateMaxAffordableUpgrade;
exports.sellSharesFailureReason = sellSharesFailureReason;
exports.buybackSharesFailureReason = buybackSharesFailureReason;
exports.issueNewSharesFailureReason = issueNewSharesFailureReason;
exports.calculateMarkupMultiplier = calculateMarkupMultiplier;
const _player_1 = require("@player");
const types_1 = require("../types");
const formatNumber_1 = require("../ui/formatNumber");
const corpConstants = __importStar(require("./data/Constants"));
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const _enums_1 = require("@enums");
const throwIfReachable_1 = require("../utils/helpers/throwIfReachable");
function convertCreatingCorporationCheckResultToMessage(checkResult) {
    switch (checkResult) {
        case _enums_1.CreatingCorporationCheckResultEnum.Success:
            return "Success";
        case _enums_1.CreatingCorporationCheckResultEnum.NoSf3OrDisabled:
            return "You don't have SF3 or Corporation is disabled by an advanced option";
        case _enums_1.CreatingCorporationCheckResultEnum.CorporationExists:
            return "Corporation exists";
        case _enums_1.CreatingCorporationCheckResultEnum.UseSeedMoneyOutsideBN3:
            return "You cannot use seed money outside BitNode 3";
        case _enums_1.CreatingCorporationCheckResultEnum.DisabledBySoftCap:
            return "You cannot create a corporation in this BitNode";
        default:
            (0, throwIfReachable_1.throwIfReachable)(checkResult);
    }
    return String(checkResult);
}
function canCreateCorporation(selfFund, restart) {
    if (!_player_1.Player.canAccessCorporation()) {
        return _enums_1.CreatingCorporationCheckResultEnum.NoSf3OrDisabled;
    }
    if (_player_1.Player.corporation && !restart) {
        return _enums_1.CreatingCorporationCheckResultEnum.CorporationExists;
    }
    if (_player_1.Player.bitNodeN !== 3 && !selfFund) {
        return _enums_1.CreatingCorporationCheckResultEnum.UseSeedMoneyOutsideBN3;
    }
    if (BitNodeMultipliers_1.currentNodeMults.CorporationSoftcap < 0.15) {
        return _enums_1.CreatingCorporationCheckResultEnum.DisabledBySoftCap;
    }
    return _enums_1.CreatingCorporationCheckResultEnum.Success;
}
function costOfCreatingCorporation(restart) {
    if (restart && !_player_1.Player.corporation?.seedFunded) {
        return 50e9;
    }
    return 150e9;
}
function calculateUpgradeCost(basePrice, priceMult, fromLevel, amount) {
    const baseCost = basePrice * Math.pow(priceMult, fromLevel);
    const cost = (baseCost * (1 - Math.pow(priceMult, amount))) / (1 - priceMult);
    return cost;
}
function calculateOfficeSizeUpgradeCost(currentSize, sizeIncrease) {
    if (sizeIncrease <= 0)
        throw new Error("Invalid value for sizeIncrease argument! Must be at least 0!");
    const baseCostDivisor = 0.09;
    const baseCostMultiplier = 1 + baseCostDivisor;
    const currentSizeFactor = baseCostMultiplier ** (currentSize / 3);
    const sizeIncreaseFactor = baseCostMultiplier ** (sizeIncrease / 3) - 1;
    return (corpConstants.officeInitialCost / baseCostDivisor) * currentSizeFactor * sizeIncreaseFactor;
}
function calculateMaxAffordableUpgrade(corp, upgrade) {
    const Lvl = corp.upgrades[upgrade.name].level;
    const Multi = upgrade.priceMult;
    const Base = upgrade.basePrice;
    /*
      Let's calculate X - affordable upgrade count using the formula in `calculateUpgradeCost`:
  
      Base * Multi^Lvl * (1 - Multi^X) / (1 - Multi) <= FUNDS
      (1 - Multi^X) >= FUNDS / Base / Multi^Lvl * (1 - Multi)
      Multi^X >= 1 - FUNDS / Base / Multi^Lvl * (1 - Multi)
      X <= ln(1 - FUNDS / Base / Multi^Lvl * (1 - Multi)) / ln(Multi)
    */
    const maxAffordableUpgrades = Math.floor(Math.log(1 - (corp.funds / Base / Math.pow(Multi, Lvl)) * (1 - Multi)) / Math.log(Multi));
    const sanitizedValue = maxAffordableUpgrades >= 0 ? maxAffordableUpgrades : 0;
    return sanitizedValue;
}
/** Returns a string representing the reason a share sale should fail, or empty string if there is no issue. */
function sellSharesFailureReason(corp, numShares) {
    if (!(0, types_1.isPositiveInteger)(numShares))
        return "Number of shares must be a positive integer.";
    else if (numShares > corp.numShares)
        return "You do not have that many shares to sell.";
    else if (numShares === corp.numShares)
        return "You cannot sell all your shares.";
    else if (numShares > 1e14)
        return `Cannot sell more than ${(0, formatNumber_1.formatShares)(1e14)} shares at a time.`;
    else if (!corp.public)
        return "Cannot sell shares before going public.";
    else if (corp.shareSaleCooldown)
        return `Cannot sell shares for another ${corp.convertCooldownToString(corp.shareSaleCooldown)}.`;
    return "";
}
/** Returns a string representing the reason a share buyback should fail, or empty string if there is no issue. */
function buybackSharesFailureReason(corp, numShares) {
    if (!(0, types_1.isPositiveInteger)(numShares))
        return "Number of shares must be a positive integer.";
    if (numShares > corp.issuedShares)
        return "Not enough shares are available for buyback.";
    if (numShares > 1e14)
        return `Cannot buy more than ${(0, formatNumber_1.formatShares)(1e14)} shares at a time.`;
    if (!corp.public)
        return "Cannot buy back shares before going public.";
    const [cost] = corp.calculateShareBuyback(numShares);
    if (_player_1.Player.money < cost)
        return "You cannot afford that many shares.";
    return "";
}
/** Returns a string representing the reason issuing new shares should fail, or empty string if there is no issue. */
function issueNewSharesFailureReason(corp, numShares) {
    if (!(0, types_1.isPositiveInteger)(numShares))
        return "Number of shares must be a positive integer.";
    if (numShares % 10e6 !== 0)
        return "Number of shares must be a multiple of 10 million.";
    if (!corp.public)
        return "Cannot issue new shares before going public.";
    const maxNewShares = corp.calculateMaxNewShares();
    if (numShares > maxNewShares)
        return `Number of shares cannot exceed ${maxNewShares} (20% of total shares).`;
    const cooldown = corp.issueNewSharesCooldown;
    if (cooldown > 0)
        return `Cannot issue new shares for another ${corp.convertCooldownToString(cooldown)}.`;
    return "";
}
function calculateMarkupMultiplier(sellingPrice, marketPrice, markupLimit) {
    // Sanitize sellingPrice
    if (!Number.isFinite(sellingPrice)) {
        return 1;
    }
    let markupMultiplier = 1;
    if (sellingPrice > marketPrice) {
        // markupMultiplier is a penalty modifier if sellingPrice is greater than the sum of marketPrice and markupLimit.
        if (sellingPrice > marketPrice + markupLimit) {
            markupMultiplier = Math.pow(markupLimit / (sellingPrice - marketPrice), 2);
        }
    }
    else {
        if (sellingPrice <= 0) {
            // Discard
            markupMultiplier = 1e12;
        }
        else {
            // markupMultiplier is a bonus modifier if sellingPrice is less than marketPrice.
            markupMultiplier = marketPrice / sellingPrice;
        }
    }
    return markupMultiplier;
}
