"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSleeveNumber = exports.checkSleeveAPIAccess = void 0;
exports.NetscriptSleeve = NetscriptSleeve;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const Augmentations_1 = require("../Augmentation/Augmentations");
const EnumHelper_1 = require("../utils/EnumHelper");
const APIWrapper_1 = require("../Netscript/APIWrapper");
const SleeveFactionWork_1 = require("../PersonObjects/Sleeve/Work/SleeveFactionWork");
const SleeveCompanyWork_1 = require("../PersonObjects/Sleeve/Work/SleeveCompanyWork");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const AugmentationHelpers_1 = require("../Augmentation/AugmentationHelpers");
const Factions_1 = require("../Faction/Factions");
const Work_1 = require("../PersonObjects/Sleeve/Work/Work");
const BitNodeUtils_1 = require("../BitNode/BitNodeUtils");
const Crimes_1 = require("../Crime/Crimes");
const checkSleeveAPIAccess = function (ctx) {
    /**
     * Don't change sourceFileLvl to activeSourceFileLvl. The ability to control Sleeves (via both UI and APIs) is a
     * permanent benefit.
     */
    if (_player_1.Player.bitNodeN !== 10 && _player_1.Player.sourceFileLvl(10) <= 0) {
        throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
    }
};
exports.checkSleeveAPIAccess = checkSleeveAPIAccess;
const checkSleeveNumber = function (ctx, sleeveNumber) {
    if (sleeveNumber >= _player_1.Player.sleeves.length || sleeveNumber < 0) {
        const msg = `Invalid sleeve number: ${sleeveNumber}`;
        throw NetscriptHelpers_1.helpers.errorMessage(ctx, msg);
    }
};
exports.checkSleeveNumber = checkSleeveNumber;
function NetscriptSleeve() {
    const checkSleeveAPIAccess = function (ctx) {
        if (!(0, BitNodeUtils_1.canAccessBitNodeFeature)(10)) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You do not have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10.");
        }
    };
    const checkSleeveNumber = function (ctx, sleeveNumber) {
        if (sleeveNumber >= _player_1.Player.sleeves.length || sleeveNumber < 0) {
            const msg = `Invalid sleeve number: ${sleeveNumber}`;
            NetscriptHelpers_1.helpers.log(ctx, () => msg);
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, msg);
        }
    };
    const sleeveFunctions = {
        getNumSleeves: (ctx) => () => {
            checkSleeveAPIAccess(ctx);
            return _player_1.Player.sleeves.length;
        },
        setToIdle: (ctx) => (_sleeveNumber) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            _player_1.Player.sleeves[sleeveNumber].stopWork();
        },
        setToShockRecovery: (ctx) => (_sleeveNumber) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            return _player_1.Player.sleeves[sleeveNumber].shockRecovery();
        },
        setToSynchronize: (ctx) => (_sleeveNumber) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            return _player_1.Player.sleeves[sleeveNumber].synchronize();
        },
        setToCommitCrime: (ctx) => (_sleeveNumber, _crimeType) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            const crimeType = (0, EnumHelper_1.getEnumHelper)("CrimeType").nsGetMember(ctx, _crimeType);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            const crime = Crimes_1.Crimes[crimeType];
            if (crime == null)
                return false;
            return _player_1.Player.sleeves[sleeveNumber].commitCrime(crime.type);
        },
        setToUniversityCourse: (ctx) => (_sleeveNumber, _universityName, _className) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            const universityName = NetscriptHelpers_1.helpers.string(ctx, "universityName", _universityName);
            const className = (0, EnumHelper_1.getEnumHelper)("UniversityClassType").nsGetMember(ctx, _className);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            return _player_1.Player.sleeves[sleeveNumber].takeUniversityCourse(universityName, className);
        },
        travel: (ctx) => (_sleeveNumber, _cityName) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            if (!_player_1.Player.sleeves[sleeveNumber].travel(cityName)) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Not enough money to travel.");
                return false;
            }
            return true;
        },
        setToCompanyWork: (ctx) => (_sleeveNumber, _companyName) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            const companyName = (0, EnumHelper_1.getEnumHelper)("CompanyName").nsGetMember(ctx, _companyName);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            // Cannot work at the same company that another sleeve is working at
            for (let i = 0; i < _player_1.Player.sleeves.length; ++i) {
                if (i === sleeveNumber) {
                    continue;
                }
                const other = _player_1.Player.sleeves[i];
                if ((0, SleeveCompanyWork_1.isSleeveCompanyWork)(other.currentWork) && other.currentWork.companyName === companyName) {
                    throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Sleeve ${sleeveNumber} cannot work for company ${companyName} because Sleeve ${i} is already working for them.`);
                }
            }
            return _player_1.Player.sleeves[sleeveNumber].workForCompany(companyName);
        },
        setToFactionWork: (ctx) => (_sleeveNumber, _factionName, _workType) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            const factionName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _factionName);
            const workType = (0, EnumHelper_1.getEnumHelper)("FactionWorkType").nsGetMember(ctx, _workType);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            if (!Factions_1.Factions[factionName].isMember) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Cannot work for faction ${factionName} without being a member.`);
            }
            // Cannot work at the same faction that another sleeve is working at
            for (let i = 0; i < _player_1.Player.sleeves.length; ++i) {
                if (i === sleeveNumber) {
                    continue;
                }
                const other = _player_1.Player.sleeves[i];
                if ((0, SleeveFactionWork_1.isSleeveFactionWork)(other.currentWork) && other.currentWork.factionName === factionName) {
                    throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Sleeve ${sleeveNumber} cannot work for faction ${factionName} because Sleeve ${i} is already working for them.`);
                }
            }
            if (_player_1.Player.gang && _player_1.Player.gang.facName == factionName) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Sleeve ${sleeveNumber} cannot work for faction ${factionName} because you have started a gang with them.`);
            }
            return _player_1.Player.sleeves[sleeveNumber].workForFaction(factionName, workType);
        },
        setToGymWorkout: (ctx) => (_sleeveNumber, _gymName, _stat) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            const gymName = NetscriptHelpers_1.helpers.string(ctx, "gymName", _gymName);
            const stat = (0, EnumHelper_1.getEnumHelper)("GymType").nsGetMember(ctx, _stat);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            return _player_1.Player.sleeves[sleeveNumber].workoutAtGym(gymName, stat);
        },
        getTask: (ctx) => (_sleeveNumber) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            const sl = _player_1.Player.sleeves[sleeveNumber];
            if (sl.currentWork === null)
                return null;
            return sl.currentWork.APICopy(sl);
        },
        getSleeve: (ctx) => (_sleeveNumber) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            const sl = _player_1.Player.sleeves[sleeveNumber];
            const data = {
                hp: structuredClone(sl.hp),
                skills: structuredClone(sl.skills),
                exp: structuredClone(sl.exp),
                mults: structuredClone(sl.mults),
                city: sl.city,
                shock: sl.shock,
                sync: sl.sync,
                memory: sl.memory,
                storedCycles: sl.storedCycles,
            };
            return data;
        },
        getSleeveAugmentations: (ctx) => (_sleeveNumber) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            const augs = [];
            for (let i = 0; i < _player_1.Player.sleeves[sleeveNumber].augmentations.length; i++) {
                augs.push(_player_1.Player.sleeves[sleeveNumber].augmentations[i].name);
            }
            return augs;
        },
        getSleevePurchasableAugs: (ctx) => (_sleeveNumber) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            const purchasableAugs = _player_1.Player.sleeves[sleeveNumber].findPurchasableAugs();
            const augs = [];
            for (let i = 0; i < purchasableAugs.length; i++) {
                const aug = purchasableAugs[i];
                augs.push({
                    name: aug.name,
                    cost: aug.baseCost,
                });
            }
            return augs;
        },
        purchaseSleeveAug: (ctx) => (_sleeveNumber, _augName) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            if (_player_1.Player.sleeves[sleeveNumber].shock > 0) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Sleeve shock too high: Sleeve ${sleeveNumber}`);
            }
            const aug = Augmentations_1.Augmentations[augName];
            if (!aug) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid aug: ${augName}`);
            }
            return _player_1.Player.sleeves[sleeveNumber].tryBuyAugmentation(aug);
        },
        getSleeveAugmentationPrice: (ctx) => (_augName) => {
            checkSleeveAPIAccess(ctx);
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            const aug = Augmentations_1.Augmentations[augName];
            return aug.baseCost;
        },
        getSleeveAugmentationRepReq: (ctx) => (_augName) => {
            checkSleeveAPIAccess(ctx);
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            const aug = Augmentations_1.Augmentations[augName];
            return (0, AugmentationHelpers_1.getAugCost)(aug).repCost;
        },
        setToBladeburnerAction: (ctx) => (_sleeveNumber, _action, _contract) => {
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeveNumber", _sleeveNumber);
            const action = NetscriptHelpers_1.helpers.string(ctx, "action", _action);
            checkSleeveAPIAccess(ctx);
            checkSleeveNumber(ctx, sleeveNumber);
            if (!_player_1.Player.bladeburner) {
                NetscriptHelpers_1.helpers.log(ctx, () => "You must be a member of the Bladeburner division to use this API.");
                return false;
            }
            let contract = undefined;
            if (action === _enums_1.SpecialBladeburnerActionTypeForSleeve.TakeOnContracts) {
                contract = (0, EnumHelper_1.getEnumHelper)("BladeburnerContractName").nsGetMember(ctx, _contract);
                for (let i = 0; i < _player_1.Player.sleeves.length; ++i) {
                    if (i === sleeveNumber) {
                        continue;
                    }
                    const otherWork = _player_1.Player.sleeves[i].currentWork;
                    if (otherWork?.type === Work_1.SleeveWorkType.BLADEBURNER && otherWork.actionId.name === contract) {
                        throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Sleeve ${sleeveNumber} cannot take on contracts because Sleeve ${i} is already performing that action.`);
                    }
                }
                const actionId = { type: _enums_1.BladeburnerActionType.Contract, name: contract };
                const availability = _player_1.Player.bladeburner.getActionObject(actionId).getAvailability(_player_1.Player.bladeburner);
                if (!availability.available) {
                    NetscriptHelpers_1.helpers.log(ctx, () => `Could not start action ${contract}: ${availability.error}`);
                    return false;
                }
            }
            return _player_1.Player.sleeves[sleeveNumber].bladeburner(action, contract);
        },
    };
    // Removed functions
    (0, APIWrapper_1.setRemovedFunctions)(sleeveFunctions, {
        getSleeveStats: { version: "2.2.0", replacement: "sleeve.getSleeve" },
        getInformation: { version: "2.2.0", replacement: "sleeve.getSleeve" },
    });
    return sleeveFunctions;
}
