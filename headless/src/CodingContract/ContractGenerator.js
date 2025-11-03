"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDummyContract = void 0;
exports.tryGeneratingRandomContract = tryGeneratingRandomContract;
exports.generateRandomContract = generateRandomContract;
exports.generateRandomContractOnHome = generateRandomContractOnHome;
exports.generateContract = generateContract;
const Contract_1 = require("./Contract");
const ContractTypes_1 = require("./ContractTypes");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const Factions_1 = require("../Faction/Factions");
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const AllServers_1 = require("../Server/AllServers");
const SpecialServers_1 = require("../Server/data/SpecialServers");
const Server_1 = require("../Server/Server");
const getRandomIntInclusive_1 = require("../utils/helpers/getRandomIntInclusive");
const ContractFilePath_1 = require("../Paths/ContractFilePath");
const clampNumber_1 = require("../utils/helpers/clampNumber");
function tryGeneratingRandomContract(numberOfTries) {
    /**
     * We try to generate a contract every 10 minutes. 525600 is the number of tries in 10 years. There is no reason to
     * support anything above that. We tested this number (525600) on a very old machine. It took only 300-350ms to
     * loop 525600 times and generate ~9137 contracts on that machine.
     */
    numberOfTries = (0, clampNumber_1.clampNumber)(Math.floor(numberOfTries), 0, 525600);
    if (numberOfTries < 1) {
        return;
    }
    let currentNumberOfContracts = (0, AllServers_1.GetAllServers)().reduce((sum, server) => {
        return sum + server.contracts.length;
    }, 0);
    for (let i = 0; i < numberOfTries; ++i) {
        const random = Math.random();
        /**
         * When currentNumberOfContracts is small, the probability is ~0.25. 25% is the "reasonable" chance of getting a
         * contract in normal situations (low currentNumberOfContracts). We have used this probability for a long time as a
         * constant before we decide to switch to a new function that is based on currentNumberOfContracts.
         *
         * This function was chosen due to these characteristics:
         * - The probability is exactly 0.25 if currentNumberOfContracts is 0.
         * - The probability is ~0.25 if currentNumberOfContracts is small (near 0).
         * - The probability approaches 0 when currentNumberOfContracts becomes unusually large:
         *   - If currentNumberOfContracts is 2500, the probability is 0.23861.
         *   - If currentNumberOfContracts is 5000, the probability is 0.12462.
         *   - If currentNumberOfContracts is 7500, the probability is 0.01176.
         *   - If currentNumberOfContracts is 10000, the probability is 0.0006129.
         *
         * With this function, we ensure that:
         * - The player gets a reasonable amount of contracts in normal situations.
         * - If the offline time is unusually large (being offline for years, editing save file, tampering function prototype,
         * etc.), the game will not hang when it tries to generate contracts.
         *
         * These are some data for reference:
         * - 1 month: ~1077 contracts.
         * - 3 months: ~3157 contracts.
         * - 6 months: ~5296 contracts.
         * - 12 months: ~6678 contracts.
         * - 2 years: ~7570 contracts.
         * - 5 years: ~8504 contracts.
         * - 10 years: ~9137 contracts.
         * - 25 years: ~9936 contracts.
         * - 50 years: ~10526 contracts.
         *
         * Those numbers mean: If the player does not have any contracts and is online (or loads a save file with equivalent
         * offline time) for X months/years, they will have ~Y contracts.
         */
        if (random > 100 / (399 + Math.exp(0.0012 * currentNumberOfContracts))) {
            continue;
        }
        generateRandomContract();
        ++currentNumberOfContracts;
    }
}
function generateRandomContract() {
    // Choose random server
    const randServer = getRandomServer();
    if (randServer === null) {
        return;
    }
    // Then select a random reward type. 'Money' will always be the last reward type
    const reward = getRandomReward();
    // Finally select a random problem type.
    // Difficulty is capped to not overwhelm a new player.
    const totalSFs = [..._player_1.Player.sourceFiles].reduce((total, [__bn, lvl]) => (total += lvl), 0);
    const maxDif = 2 * totalSFs + 1;
    const problemType = getRandomProblemType(maxDif);
    const contractFn = getRandomFilename(randServer, reward);
    const contract = new Contract_1.CodingContract(contractFn, problemType, reward);
    randServer.addContract(contract);
}
function generateRandomContractOnHome() {
    // First select a random problem type
    const problemType = getRandomProblemType();
    // Then select a random reward type. 'Money' will always be the last reward type
    const reward = getRandomReward();
    // Choose random server
    const serv = _player_1.Player.getHomeComputer();
    const contractFn = getRandomFilename(serv, reward);
    const contract = new Contract_1.CodingContract(contractFn, problemType, reward);
    serv.addContract(contract);
}
const generateDummyContract = (problemType) => {
    if (!ContractTypes_1.CodingContractTypes[problemType])
        throw new Error(`Invalid problem type: '${problemType}'`);
    const serv = _player_1.Player.getHomeComputer();
    const contractFn = getRandomFilename(serv);
    const contract = new Contract_1.CodingContract(contractFn, problemType, null);
    serv.addContract(contract);
    return contractFn;
};
exports.generateDummyContract = generateDummyContract;
function generateContract(params) {
    // Problem Type
    let problemType;
    const problemTypes = Object.keys(ContractTypes_1.CodingContractTypes);
    if (params.problemType && problemTypes.includes(params.problemType)) {
        problemType = params.problemType;
    }
    else {
        problemType = getRandomProblemType();
    }
    // Reward Type - This is always random for now
    const reward = getRandomReward();
    // Server
    let server;
    if (params.server != null) {
        server = (0, AllServers_1.GetServer)(params.server);
        if (server == null) {
            server = getRandomServer();
        }
    }
    else {
        server = getRandomServer();
    }
    if (server === null) {
        return;
    }
    const filename = params.fn ? params.fn : getRandomFilename(server, reward);
    const contract = new Contract_1.CodingContract(filename, problemType, reward);
    server.addContract(contract);
}
// Ensures that a contract's reward type is valid
function sanitizeRewardType(rewardType) {
    let type = rewardType; // Create copy
    const factionsThatAllowHacking = _player_1.Player.factions.filter((fac) => {
        try {
            return Factions_1.Factions[fac].getInfo().offerHackingWork;
        }
        catch (e) {
            console.error("Error when trying to filter Hacking Factions for Coding Contract Generation", e);
            return false;
        }
    });
    if (type === Contract_1.CodingContractRewardType.FactionReputation && factionsThatAllowHacking.length === 0) {
        type = Contract_1.CodingContractRewardType.CompanyReputation;
    }
    if (type === Contract_1.CodingContractRewardType.FactionReputationAll && factionsThatAllowHacking.length === 0) {
        type = Contract_1.CodingContractRewardType.CompanyReputation;
    }
    if (type === Contract_1.CodingContractRewardType.CompanyReputation && Object.keys(_player_1.Player.jobs).length === 0) {
        type = Contract_1.CodingContractRewardType.Money;
    }
    return type;
}
function getRandomProblemType(maxDif = 10) {
    const problemTypes = Object.values(_enums_1.CodingContractName).filter((x) => ContractTypes_1.CodingContractTypes[x].difficulty <= maxDif);
    const randIndex = (0, getRandomIntInclusive_1.getRandomIntInclusive)(0, problemTypes.length - 1);
    return problemTypes[randIndex];
}
function getRandomReward() {
    // Don't offer money reward by default if BN multiplier is 0 (e.g. BN8)
    const rewardTypeUpperBound = BitNodeMultipliers_1.currentNodeMults.CodingContractMoney === 0 ? Contract_1.CodingContractRewardType.Money - 1 : Contract_1.CodingContractRewardType.Money;
    const rewardType = sanitizeRewardType((0, getRandomIntInclusive_1.getRandomIntInclusive)(0, rewardTypeUpperBound));
    // Add additional information based on the reward type
    const factionsThatAllowHacking = _player_1.Player.factions.filter((fac) => Factions_1.Factions[fac].getInfo().offerHackingWork);
    switch (rewardType) {
        case Contract_1.CodingContractRewardType.FactionReputation: {
            // Get a random faction that player is a part of. That
            // faction must allow hacking contracts
            const numFactions = factionsThatAllowHacking.length;
            // This check is unnecessary because sanitizeRewardType ensures that it won't happen. However, I'll still leave
            // it here, just in case somebody else changes sanitizeRewardType without taking account of this check.
            if (numFactions > 0) {
                const randFaction = factionsThatAllowHacking[(0, getRandomIntInclusive_1.getRandomIntInclusive)(0, numFactions - 1)];
                return { type: rewardType, name: randFaction };
            }
            return { type: Contract_1.CodingContractRewardType.Money };
        }
        case Contract_1.CodingContractRewardType.CompanyReputation: {
            const allJobs = Object.keys(_player_1.Player.jobs);
            // This check is also unnecessary. Check the comment above.
            if (allJobs.length > 0) {
                return {
                    type: Contract_1.CodingContractRewardType.CompanyReputation,
                    name: allJobs[(0, getRandomIntInclusive_1.getRandomIntInclusive)(0, allJobs.length - 1)],
                };
            }
            return { type: Contract_1.CodingContractRewardType.Money };
        }
        default:
            return { type: rewardType };
    }
}
function getRandomServer() {
    const servers = (0, AllServers_1.GetAllServers)().filter((server) => server.serversOnNetwork.length !== 0);
    if (servers.length === 0) {
        return null;
    }
    let randIndex = (0, getRandomIntInclusive_1.getRandomIntInclusive)(0, servers.length - 1);
    let randServer = servers[randIndex];
    // An infinite loop shouldn't ever happen, but to be safe we'll use
    // a for loop with a limited number of tries
    for (let i = 0; i < 200; ++i) {
        if (randServer instanceof Server_1.Server &&
            !randServer.purchasedByPlayer &&
            randServer.hostname !== SpecialServers_1.SpecialServers.WorldDaemon) {
            break;
        }
        randIndex = (0, getRandomIntInclusive_1.getRandomIntInclusive)(0, servers.length - 1);
        randServer = servers[randIndex];
    }
    return randServer;
}
function getRandomFilename(server, reward = { type: Contract_1.CodingContractRewardType.Money }) {
    let contractFn = `contract-${(0, getRandomIntInclusive_1.getRandomIntInclusive)(0, 1e6)}`;
    for (let i = 0; i < 1000; ++i) {
        if (server.contracts.filter((c) => {
            return c.fn === contractFn;
        }).length <= 0) {
            break;
        }
        contractFn = `contract-${(0, getRandomIntInclusive_1.getRandomIntInclusive)(0, 1e6)}`;
    }
    if ("name" in reward) {
        // Only alphanumeric characters in the reward name.
        contractFn += `-${reward.name.replace(/[^a-zA-Z0-9]/g, "")}`;
    }
    contractFn += ".cct";
    const validatedPath = (0, ContractFilePath_1.resolveContractFilePath)(contractFn);
    if (!validatedPath)
        throw new Error(`Generated contract path could not be validated: ${contractFn}`);
    return validatedPath;
}
