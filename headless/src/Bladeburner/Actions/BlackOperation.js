"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackOperation = void 0;
const _enums_1 = require("@enums");
const Action_1 = require("./Action");
const Operation_1 = require("./Operation");
const EnumHelper_1 = require("../../utils/EnumHelper");
class BlackOperation extends Action_1.ActionClass {
    get id() {
        return BlackOperation.createId(this.name);
    }
    static createId(name) {
        return { type: _enums_1.BladeburnerActionType.BlackOp, name };
    }
    static IsAcceptedName(name) {
        return (0, EnumHelper_1.getEnumHelper)("BladeburnerBlackOpName").isMember(name);
    }
    constructor(params) {
        super(params);
        this.type = _enums_1.BladeburnerActionType.BlackOp;
        this.teamCount = 0;
        this.getTeamSuccessBonus = Operation_1.operationTeamSuccessBonus;
        this.getActionTypeSkillSuccessBonus = Operation_1.operationSkillSuccessBonus;
        this.name = params.name;
        this.reqdRank = params.reqdRank;
        this.n = params.n;
    }
    getAvailability(bladeburner) {
        if (bladeburner.numBlackOpsComplete < this.n)
            return { error: "Have not completed the previous Black Operation" };
        if (bladeburner.numBlackOpsComplete > this.n)
            return { error: "Already completed" };
        if (bladeburner.rank < this.reqdRank)
            return { error: "Insufficient rank" };
        return { available: true };
    }
    getActionTimePenalty() {
        return 1.5;
    }
    getPopulationSuccessFactor() {
        return 1;
    }
    getChaosSuccessFactor() {
        return 1;
    }
    getMinimumCasualties() {
        return 1;
    }
}
exports.BlackOperation = BlackOperation;
