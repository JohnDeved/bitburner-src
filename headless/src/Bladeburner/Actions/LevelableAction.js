"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelableActionClass = void 0;
const Action_1 = require("./Action");
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
const clampNumber_1 = require("../../utils/helpers/clampNumber");
class LevelableActionClass extends Action_1.ActionClass {
    constructor(params = null) {
        super(params);
        // Static info, not included in save
        this.difficultyFac = 1.01;
        this.rewardFac = 1.02;
        this.growthFunction = () => 0;
        this.minCount = 1;
        this.maxCount = 150;
        // Dynamic properties included in save
        this.count = 0;
        this.level = 1;
        this.maxLevel = 1;
        this.autoLevel = true;
        this.successes = 0;
        this.failures = 0;
        if (!params)
            return;
        if (params.minCount)
            this.minCount = params.minCount;
        if (params.maxCount)
            this.maxCount = params.maxCount;
        if (params.difficultyFac)
            this.difficultyFac = params.difficultyFac;
        if (params.rewardFac)
            this.rewardFac = params.rewardFac;
        this.count = (0, getRandomIntInclusive_1.getRandomIntInclusive)(this.minCount, this.maxCount);
        this.growthFunction = params.growthFunction;
    }
    getAvailability(__bladeburner) {
        if (this.count < 1)
            return { error: "Insufficient action count" };
        return { available: true };
    }
    setMaxLevel(baseSuccessesPerLevel) {
        if (this.successes >= this.getSuccessesNeededForNextLevel(baseSuccessesPerLevel)) {
            ++this.maxLevel;
        }
    }
    getSuccessesNeededForNextLevel(baseSuccessesPerLevel) {
        return Math.ceil(0.5 * this.maxLevel * (2 * baseSuccessesPerLevel + (this.maxLevel - 1)));
    }
    getDifficulty() {
        const difficulty = this.baseDifficulty * Math.pow(this.difficultyFac, this.level - 1);
        if (isNaN(difficulty)) {
            throw new Error("Calculated NaN in Action.getDifficulty()");
        }
        return difficulty;
    }
    /** Reset a levelable action's tracked stats */
    reset() {
        this.count = (0, getRandomIntInclusive_1.getRandomIntInclusive)(this.minCount, this.maxCount);
        this.level = 1;
        this.maxLevel = 1;
        this.autoLevel = true;
        this.successes = 0;
        this.failures = 0;
    }
    /** These are not loaded the same way as most game objects, to allow better typechecking on load + partially static loading */
    loadData(loadedObject) {
        this.maxLevel = (0, clampNumber_1.clampInteger)(loadedObject.maxLevel, 1);
        this.level = (0, clampNumber_1.clampInteger)(loadedObject.level, 1, this.maxLevel);
        this.count = (0, clampNumber_1.clampInteger)(loadedObject.count, 0);
        this.autoLevel = !!loadedObject.autoLevel;
        this.successes = (0, clampNumber_1.clampInteger)(loadedObject.successes, 0);
        this.failures = (0, clampNumber_1.clampInteger)(loadedObject.failures, 0);
    }
    /** Create a basic object just containing the relevant data for a levelable action */
    save(ctorName, ...extraParams) {
        const data = {
            ...Object.fromEntries(extraParams.map((param) => [param, this[param]])),
            count: this.count,
            level: this.level,
            maxLevel: this.maxLevel,
            autoLevel: this.autoLevel,
            successes: this.successes,
            failures: this.failures,
        };
        return { ctor: ctorName, data };
    }
}
exports.LevelableActionClass = LevelableActionClass;
