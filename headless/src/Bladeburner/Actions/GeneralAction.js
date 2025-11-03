"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralAction = void 0;
const _enums_1 = require("@enums");
const Action_1 = require("./Action");
const clampNumber_1 = require("../../utils/helpers/clampNumber");
const EnumHelper_1 = require("../../utils/EnumHelper");
class GeneralAction extends Action_1.ActionClass {
    get id() {
        return GeneralAction.createId(this.name);
    }
    static IsAcceptedName(name) {
        return (0, EnumHelper_1.getEnumHelper)("BladeburnerGeneralActionName").isMember(name);
    }
    static createId(name) {
        return { type: _enums_1.BladeburnerActionType.General, name };
    }
    constructor(params) {
        super(params);
        this.type = _enums_1.BladeburnerActionType.General;
        this.name = params.name;
        this.getActionTime = params.getActionTime;
        if (params.getSuccessChance)
            this.getSuccessChance = params.getSuccessChance;
    }
    getSuccessChance(__bladeburner, __person) {
        return 1;
    }
    getSuccessRange(bladeburner, person) {
        const chance = (0, clampNumber_1.clampNumber)(this.getSuccessChance(bladeburner, person), 0, 1);
        return [chance, chance];
    }
}
exports.GeneralAction = GeneralAction;
