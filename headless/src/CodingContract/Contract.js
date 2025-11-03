"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodingContract = exports.CodingContractResult = exports.CodingContractRewardType = void 0;
const _enums_1 = require("@enums");
const ContractTypes_1 = require("./ContractTypes");
const JSONReviver_1 = require("../utils/JSONReviver");
const ContractFilePath_1 = require("../Paths/ContractFilePath");
const TypeAssertion_1 = require("../utils/TypeAssertion");
const CodingContractEventEmitter_1 = require("./CodingContractEventEmitter");
// Numeric enum
/** Enum representing the different types of rewards a Coding Contract can give */
var CodingContractRewardType;
(function (CodingContractRewardType) {
    CodingContractRewardType[CodingContractRewardType["FactionReputation"] = 0] = "FactionReputation";
    CodingContractRewardType[CodingContractRewardType["FactionReputationAll"] = 1] = "FactionReputationAll";
    CodingContractRewardType[CodingContractRewardType["CompanyReputation"] = 2] = "CompanyReputation";
    CodingContractRewardType[CodingContractRewardType["Money"] = 3] = "Money";
})(CodingContractRewardType || (exports.CodingContractRewardType = CodingContractRewardType = {}));
// Numeric enum
/** Enum representing the result when trying to solve the Contract */
var CodingContractResult;
(function (CodingContractResult) {
    CodingContractResult[CodingContractResult["Success"] = 0] = "Success";
    CodingContractResult[CodingContractResult["Failure"] = 1] = "Failure";
    CodingContractResult[CodingContractResult["Cancelled"] = 2] = "Cancelled";
    CodingContractResult[CodingContractResult["InvalidFormat"] = 3] = "InvalidFormat";
})(CodingContractResult || (exports.CodingContractResult = CodingContractResult = {}));
/**
 * A Coding Contract is a file that poses a programming-related problem to the Player.
 * The player receives a reward if the problem is solved correctly
 */
class CodingContract {
    constructor(fn = "default.cct", type = _enums_1.CodingContractName.FindLargestPrimeFactor, reward = null) {
        /* Number of times the Contract has been attempted */
        this.tries = 0;
        const path = (0, ContractFilePath_1.resolveContractFilePath)(fn);
        if (!path) {
            throw new Error(`Bad file path while creating a coding contract: ${fn}`);
        }
        if (!ContractTypes_1.CodingContractTypes[type]) {
            throw new Error(`Error: invalid contract type: ${type} please contact developer`);
        }
        this.fn = path;
        this.type = type;
        this.state = ContractTypes_1.CodingContractTypes[type].generate();
        this.reward = reward;
    }
    getData() {
        const func = ContractTypes_1.CodingContractTypes[this.type].getData;
        return func ? func(this.state) : this.state;
    }
    getDescription() {
        return ContractTypes_1.CodingContractTypes[this.type].desc(this.getData());
    }
    getDifficulty() {
        return ContractTypes_1.CodingContractTypes[this.type].difficulty;
    }
    getMaxNumTries() {
        return ContractTypes_1.CodingContractTypes[this.type].numTries ?? 10;
    }
    getType() {
        return this.type;
    }
    /** Checks if the answer is in the correct format. */
    isValid(answer) {
        if (typeof answer === "string") {
            try {
                answer = ContractTypes_1.CodingContractTypes[this.type].convertAnswer(answer);
            }
            catch (error) {
                return {
                    success: false,
                    message: `The answer is not in the right format for contract '${this.type}'. Reason: ${error instanceof Error ? error.message : String(error)}`,
                };
            }
        }
        const result = ContractTypes_1.CodingContractTypes[this.type].validateAnswer(answer);
        if (!result) {
            return {
                success: false,
                message: `The answer is not in the right format for contract '${this.type}'. Got: ${answer}`,
            };
        }
        return { success: true, answer };
    }
    isSolution(solution) {
        const validationResult = this.isValid(solution);
        if (!validationResult.success) {
            return { result: CodingContractResult.InvalidFormat, message: validationResult.message };
        }
        /**
         * We sometimes need to convert the given solution by calling CodingContractType.convertAnswer() (e.g., Square Root
         * contract) before using it. The conversion is done in CodingContract.isValid().
         */
        solution = validationResult.answer;
        return {
            result: ContractTypes_1.CodingContractTypes[this.type].solver(this.state, solution)
                ? CodingContractResult.Success
                : CodingContractResult.Failure,
        };
    }
    /** Creates a popup to prompt the player to solve the problem */
    async prompt() {
        return new Promise((resolve) => {
            CodingContractEventEmitter_1.CodingContractEventEmitter.emit({
                type: "run",
                data: {
                    codingContract: this,
                    onClose: () => {
                        resolve({ result: CodingContractResult.Cancelled });
                    },
                    onAttempt: (val) => {
                        resolve(this.isSolution(val));
                    },
                },
            });
        });
    }
    /** Serialize the current file to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("CodingContract", this);
    }
    /** Initializes a CodingContract from a JSON save state. */
    static fromJSON(value) {
        (0, TypeAssertion_1.assertObject)(value.data);
        // In previous versions, there was a data field instead of a state field.
        if ("data" in value.data) {
            value.data.state = value.data.data;
            delete value.data.data;
        }
        return (0, JSONReviver_1.Generic_fromJSON)(CodingContract, value.data);
    }
}
exports.CodingContract = CodingContract;
JSONReviver_1.constructorsForReviver.CodingContract = CodingContract;
