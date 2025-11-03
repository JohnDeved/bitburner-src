"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleeveBladeburnerWork = exports.isSleeveBladeburnerWork = void 0;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const JSONReviver_1 = require("../../../utils/JSONReviver");
const Work_1 = require("./Work");
const Constants_1 = require("../../../Constants");
const WorkStats_1 = require("../../../Work/WorkStats");
const getKeyList_1 = require("../../../utils/helpers/getKeyList");
const loadActionIdentifier_1 = require("../../../Bladeburner/utils/loadActionIdentifier");
const InvalidWork_1 = require("../../../Work/InvalidWork");
const TypeAssertion_1 = require("../../../utils/TypeAssertion");
const isSleeveBladeburnerWork = (w) => w?.type === Work_1.SleeveWorkType.BLADEBURNER;
exports.isSleeveBladeburnerWork = isSleeveBladeburnerWork;
class SleeveBladeburnerWork extends Work_1.SleeveWorkClass {
    constructor(params) {
        super();
        this.type = Work_1.SleeveWorkType.BLADEBURNER;
        this.tasksCompleted = 0;
        this.cyclesWorked = 0;
        this.nextCompletionPair = { promise: null, resolve: null };
        this.actionId = params?.actionId ?? {
            type: _enums_1.BladeburnerActionType.General,
            name: _enums_1.BladeburnerGeneralActionName.FieldAnalysis,
        };
    }
    cyclesNeeded(sleeve) {
        if (!_player_1.Player.bladeburner)
            return Infinity;
        const action = _player_1.Player.bladeburner.getActionObject(this.actionId);
        const timeInMs = action.getActionTime(_player_1.Player.bladeburner, sleeve) * 1000;
        return timeInMs / Constants_1.CONSTANTS.MilliPerCycle;
    }
    finish() {
        if (this.nextCompletionPair.resolve) {
            this.nextCompletionPair.resolve();
            this.nextCompletionPair.resolve = null;
            this.nextCompletionPair.promise = null;
        }
    }
    process(sleeve, cycles) {
        if (!_player_1.Player.bladeburner)
            return sleeve.stopWork();
        this.cyclesWorked += cycles;
        if (this.actionId.type === _enums_1.BladeburnerActionType.Contract) {
            const action = _player_1.Player.bladeburner.getActionObject(this.actionId);
            if (action.count < 1)
                return sleeve.stopWork();
        }
        while (this.cyclesWorked >= this.cyclesNeeded(sleeve)) {
            if (this.actionId.type === _enums_1.BladeburnerActionType.Contract) {
                const action = _player_1.Player.bladeburner.getActionObject(this.actionId);
                if (action.count < 1)
                    return sleeve.stopWork();
            }
            const retValue = _player_1.Player.bladeburner.completeAction(sleeve, this.actionId, false);
            (0, Work_1.applySleeveGains)(sleeve, (0, WorkStats_1.scaleWorkStats)(retValue, sleeve.shockBonus(), false));
            this.tasksCompleted++;
            this.cyclesWorked -= this.cyclesNeeded(sleeve);
            // Resolve and reset nextCompletion promise
            this.finish();
        }
    }
    get nextCompletion() {
        if (!this.nextCompletionPair.promise)
            this.nextCompletionPair.promise = new Promise((r) => (this.nextCompletionPair.resolve = r));
        return this.nextCompletionPair.promise;
    }
    APICopy(sleeve) {
        return {
            type: Work_1.SleeveWorkType.BLADEBURNER,
            actionType: this.actionId.type,
            actionName: this.actionId.name,
            tasksCompleted: this.tasksCompleted,
            cyclesWorked: this.cyclesWorked,
            cyclesNeeded: this.cyclesNeeded(sleeve),
            nextCompletion: this.nextCompletion,
        };
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("SleeveBladeburnerWork", this, SleeveBladeburnerWork.savedKeys);
    }
    /** Initializes a BladeburnerWork object from a JSON save state. */
    static fromJSON(value) {
        (0, TypeAssertion_1.assertObject)(value.data);
        let actionId = (0, loadActionIdentifier_1.loadActionIdentifier)(value.data?.actionId);
        if (!actionId) {
            /**
             * In pre-v2.6.1 versions, "name" and "type" of actionId are saved directly in "actionName" and "actionType", not
             * in the actionId object.
             */
            if (!value.data["actionName"]) {
                return (0, InvalidWork_1.invalidWork)();
            }
            actionId = (0, loadActionIdentifier_1.loadActionIdentifier)({ name: value.data["actionName"], type: value.data["actionType"] });
            if (!actionId) {
                return (0, InvalidWork_1.invalidWork)();
            }
        }
        value.data.actionId = actionId;
        return (0, JSONReviver_1.Generic_fromJSON)(SleeveBladeburnerWork, value.data, SleeveBladeburnerWork.savedKeys);
    }
}
exports.SleeveBladeburnerWork = SleeveBladeburnerWork;
SleeveBladeburnerWork.savedKeys = (0, getKeyList_1.getKeyList)(SleeveBladeburnerWork, { removedKeys: ["nextCompletionPair"] });
JSONReviver_1.constructorsForReviver.SleeveBladeburnerWork = SleeveBladeburnerWork;
