"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationSkillSuccessBonus = exports.Operation = void 0;
exports.operationTeamSuccessBonus = operationTeamSuccessBonus;
const _enums_1 = require("@enums");
const Constants_1 = require("../data/Constants");
const Action_1 = require("./Action");
const JSONReviver_1 = require("../../utils/JSONReviver");
const LevelableAction_1 = require("./LevelableAction");
const clampNumber_1 = require("../../utils/helpers/clampNumber");
const EnumHelper_1 = require("../../utils/EnumHelper");
class Operation extends LevelableAction_1.LevelableActionClass {
    get id() {
        return Operation.createId(this.name);
    }
    static IsAcceptedName(name) {
        return (0, EnumHelper_1.getEnumHelper)("BladeburnerOperationName").isMember(name);
    }
    static createId(name) {
        return { type: _enums_1.BladeburnerActionType.Operation, name };
    }
    constructor(params = null) {
        super(params);
        this.type = _enums_1.BladeburnerActionType.Operation;
        this.teamCount = 0;
        // These functions are shared between operations and blackops, so they are defined outside of Operation
        this.getTeamSuccessBonus = operationTeamSuccessBonus;
        this.getActionTypeSkillSuccessBonus = exports.operationSkillSuccessBonus;
        this.name = params?.name ?? _enums_1.BladeburnerOperationName.Investigation;
        if (params && params.getAvailability)
            this.getAvailability = params.getAvailability;
    }
    getMinimumCasualties() {
        return 0;
    }
    getChaosSuccessFactor(inst /*, params: ISuccessChanceParams*/) {
        const city = inst.getCurrentCity();
        if (city.chaos > Constants_1.BladeburnerConstants.ChaosThreshold) {
            const diff = 1 + (city.chaos - Constants_1.BladeburnerConstants.ChaosThreshold);
            const mult = Math.pow(diff, 0.5);
            return mult;
        }
        return 1;
    }
    getSuccessChance(inst, person, params) {
        if (this.name === _enums_1.BladeburnerOperationName.Raid && inst.getCurrentCity().comms <= 0) {
            return 0;
        }
        return Action_1.ActionClass.prototype.getSuccessChance.call(this, inst, person, params);
    }
    reset() {
        LevelableAction_1.LevelableActionClass.prototype.reset.call(this);
        this.teamCount = 0;
    }
    toJSON() {
        return this.save("Operation", "teamCount");
    }
    loadData(loadedObject) {
        this.teamCount = (0, clampNumber_1.clampInteger)(loadedObject.teamCount, 0);
        LevelableAction_1.LevelableActionClass.prototype.loadData.call(this, loadedObject);
    }
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(Operation, value.data);
    }
}
exports.Operation = Operation;
JSONReviver_1.constructorsForReviver.Operation = Operation;
// shared member functions for Operation and BlackOperation
const operationSkillSuccessBonus = (inst) => {
    return inst.getSkillMult(_enums_1.BladeburnerMultName.SuccessChanceOperation);
};
exports.operationSkillSuccessBonus = operationSkillSuccessBonus;
function operationTeamSuccessBonus(inst) {
    if (this.teamCount && this.teamCount > 0) {
        this.teamCount = Math.min(this.teamCount, inst.teamSize);
        const teamMultiplier = Math.pow(this.teamCount, 0.05);
        return teamMultiplier;
    }
    return 1;
}
