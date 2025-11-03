"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const JSONReviver_1 = require("../../utils/JSONReviver");
const Enums_1 = require("../Enums");
const LevelableAction_1 = require("./LevelableAction");
const EnumHelper_1 = require("../../utils/EnumHelper");
class Contract extends LevelableAction_1.LevelableActionClass {
    get id() {
        return Contract.createId(this.name);
    }
    static IsAcceptedName(name) {
        return (0, EnumHelper_1.getEnumHelper)("BladeburnerContractName").isMember(name);
    }
    static createId(name) {
        return { type: Enums_1.BladeburnerActionType.Contract, name };
    }
    constructor(params = null) {
        super(params);
        this.type = Enums_1.BladeburnerActionType.Contract;
        this.name = params?.name ?? Enums_1.BladeburnerContractName.Tracking;
    }
    getActionTypeSkillSuccessBonus(inst) {
        return inst.getSkillMult(Enums_1.BladeburnerMultName.SuccessChanceContract);
    }
    toJSON() {
        return this.save("Contract");
    }
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(Contract, value.data);
    }
}
exports.Contract = Contract;
JSONReviver_1.constructorsForReviver.Contract = Contract;
