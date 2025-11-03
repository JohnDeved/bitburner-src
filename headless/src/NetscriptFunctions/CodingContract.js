"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptCodingContract = NetscriptCodingContract;
const _player_1 = require("@player");
const Contract_1 = require("../CodingContract/Contract");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const _enums_1 = require("@enums");
const ContractGenerator_1 = require("../CodingContract/ContractGenerator");
const exceptionAlert_1 = require("../utils/helpers/exceptionAlert");
const EnumHelper_1 = require("../utils/EnumHelper");
function NetscriptCodingContract() {
    const getCodingContract = function (ctx, hostname, filename) {
        const server = NetscriptHelpers_1.helpers.getServer(ctx, hostname);
        const contract = server.getContract(filename);
        if (contract == null) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Cannot find contract '${filename}' on server '${hostname}'`);
        }
        return contract;
    };
    function attemptContract(ctx, server, contract, answer) {
        const validationResult = contract.isValid(answer);
        if (!validationResult.success) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, validationResult.message);
        }
        const resultOfCheckingSolution = contract.isSolution(answer);
        switch (resultOfCheckingSolution.result) {
            case Contract_1.CodingContractResult.Success: {
                const reward = _player_1.Player.gainCodingContractReward(contract.reward, contract.getDifficulty());
                NetscriptHelpers_1.helpers.log(ctx, () => `Successfully completed Coding Contract '${contract.fn}'. Reward: ${reward}`);
                server.removeContract(contract.fn);
                return reward;
            }
            /**
             * This should never happen. If the answer format is invalid, it should already be handled by the call to
             * contract.isValid() above.
             */
            case Contract_1.CodingContractResult.InvalidFormat: {
                (0, exceptionAlert_1.exceptionAlert)(new Error(`contract.isSolution() returns unexpected InvalidFormat result. Type: ${contract.type}. Answer: ${answer}`), true);
                return "";
            }
            case Contract_1.CodingContractResult.Failure: {
                if (++contract.tries >= contract.getMaxNumTries()) {
                    NetscriptHelpers_1.helpers.log(ctx, () => `Coding Contract attempt '${contract.fn}' failed. Contract is now self-destructing`);
                    server.removeContract(contract.fn);
                }
                else {
                    NetscriptHelpers_1.helpers.log(ctx, () => `Coding Contract attempt '${contract.fn}' failed. ${contract.getMaxNumTries() - contract.tries} attempt(s) remaining.`);
                }
                return "";
            }
            default: {
                const __ = resultOfCheckingSolution.result;
            }
        }
        return "";
    }
    return {
        attempt: (ctx) => (answer, _filename, _host) => {
            const filename = NetscriptHelpers_1.helpers.string(ctx, "filename", _filename);
            const host = _host ? NetscriptHelpers_1.helpers.string(ctx, "host", _host) : ctx.workerScript.hostname;
            const contract = getCodingContract(ctx, host, filename);
            const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
            return attemptContract(ctx, server, contract, answer);
        },
        getContractType: (ctx) => (_filename, _host) => {
            const filename = NetscriptHelpers_1.helpers.string(ctx, "filename", _filename);
            const host = _host ? NetscriptHelpers_1.helpers.string(ctx, "host", _host) : ctx.workerScript.hostname;
            const contract = getCodingContract(ctx, host, filename);
            return contract.getType();
        },
        getData: (ctx) => (_filename, _host) => {
            const filename = NetscriptHelpers_1.helpers.string(ctx, "filename", _filename);
            const host = _host ? NetscriptHelpers_1.helpers.string(ctx, "host", _host) : ctx.workerScript.hostname;
            const contract = getCodingContract(ctx, host, filename);
            return structuredClone(contract.getData());
        },
        getContract: (ctx) => (_filename, _host) => {
            const filename = NetscriptHelpers_1.helpers.string(ctx, "filename", _filename);
            const host = _host ? NetscriptHelpers_1.helpers.string(ctx, "host", _host) : ctx.workerScript.hostname;
            const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
            const contract = getCodingContract(ctx, host, filename);
            // asserting type here is required, since it is not feasible to properly type getData
            return {
                type: contract.type,
                data: structuredClone(contract.getData()),
                submit: (answer) => {
                    NetscriptHelpers_1.helpers.checkEnvFlags(ctx);
                    return attemptContract(ctx, server, contract, answer);
                },
                description: contract.getDescription(),
                difficulty: contract.getDifficulty(),
                numTriesRemaining: () => {
                    NetscriptHelpers_1.helpers.checkEnvFlags(ctx);
                    return contract.getMaxNumTries() - contract.tries;
                },
            };
        },
        getDescription: (ctx) => (_filename, _host) => {
            const filename = NetscriptHelpers_1.helpers.string(ctx, "filename", _filename);
            const host = _host ? NetscriptHelpers_1.helpers.string(ctx, "host", _host) : ctx.workerScript.hostname;
            const contract = getCodingContract(ctx, host, filename);
            return contract.getDescription();
        },
        getNumTriesRemaining: (ctx) => (_filename, _host) => {
            const filename = NetscriptHelpers_1.helpers.string(ctx, "filename", _filename);
            const host = _host ? NetscriptHelpers_1.helpers.string(ctx, "host", _host) : ctx.workerScript.hostname;
            const contract = getCodingContract(ctx, host, filename);
            return contract.getMaxNumTries() - contract.tries;
        },
        createDummyContract: (ctx) => (_type) => {
            const type = (0, EnumHelper_1.getEnumHelper)("CodingContractName").nsGetMember(ctx, _type);
            return (0, ContractGenerator_1.generateDummyContract)(type);
        },
        getContractTypes: () => () => Object.values(_enums_1.CodingContractName),
    };
}
