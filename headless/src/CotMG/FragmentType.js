"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FragmentTypeEnum = void 0;
exports.Effect = Effect;
// Numeric enum
exports.FragmentTypeEnum = {
    HackingSpeed: 3,
    HackingMoney: 4,
    HackingGrow: 5,
    Hacking: 6,
    Strength: 7,
    Defense: 8,
    Dexterity: 9,
    Agility: 10,
    Charisma: 11,
    HacknetMoney: 12,
    HacknetCost: 13,
    Rep: 14,
    WorkMoney: 15,
    Crime: 16,
    Bladeburner: 17,
    // Utility fragments.
    Booster: 18,
};
function Effect(type) {
    switch (type) {
        case exports.FragmentTypeEnum.HackingSpeed: {
            return "+x% faster hack(), grow(), and weaken()";
        }
        case exports.FragmentTypeEnum.HackingMoney: {
            return "+x% hack() power";
        }
        case exports.FragmentTypeEnum.HackingGrow: {
            return "+x% grow() power";
        }
        case exports.FragmentTypeEnum.Hacking: {
            return "+x% hacking experience and skill level";
        }
        case exports.FragmentTypeEnum.Strength: {
            return "+x% strength experience and skill level";
        }
        case exports.FragmentTypeEnum.Defense: {
            return "+x% defense experience and skill level";
        }
        case exports.FragmentTypeEnum.Dexterity: {
            return "+x% dexterity experience and skill level";
        }
        case exports.FragmentTypeEnum.Agility: {
            return "+x% agility experience and skill level";
        }
        case exports.FragmentTypeEnum.Charisma: {
            return "+x% charisma experience and skill level";
        }
        case exports.FragmentTypeEnum.HacknetMoney: {
            return "+x% hacknet production";
        }
        case exports.FragmentTypeEnum.HacknetCost: {
            return "-x% cheaper hacknet costs";
        }
        case exports.FragmentTypeEnum.Rep: {
            return "+x% reputation from factions and companies";
        }
        case exports.FragmentTypeEnum.WorkMoney: {
            return "+x% work money";
        }
        case exports.FragmentTypeEnum.Crime: {
            return "+x% crime money and success chance";
        }
        case exports.FragmentTypeEnum.Bladeburner: {
            return "+x% bladeburner stats (max stamina, stamina gain, Field Analysis effectiveness, action success chance)";
        }
        case exports.FragmentTypeEnum.Booster: {
            return "1.1x adjacent fragment power";
        }
    }
}
