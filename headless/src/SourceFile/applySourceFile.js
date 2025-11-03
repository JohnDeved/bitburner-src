"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySourceFile = applySourceFile;
const SourceFiles_1 = require("./SourceFiles");
const _player_1 = require("@player");
function applySourceFile(bn, lvl) {
    const srcFileKey = "SourceFile" + bn;
    const sourceFileObject = SourceFiles_1.SourceFiles[srcFileKey];
    if (sourceFileObject == null) {
        console.error(`Invalid source file number: ${bn}`);
        return;
    }
    switch (bn) {
        case 1: {
            // The Source Genesis
            let mult = 0;
            for (let i = 0; i < lvl; ++i) {
                mult += 16 / Math.pow(2, i);
            }
            const incMult = 1 + mult / 100;
            const decMult = 1 / incMult;
            _player_1.Player.mults.hacking_chance *= incMult;
            _player_1.Player.mults.hacking_speed *= incMult;
            _player_1.Player.mults.hacking_money *= incMult;
            _player_1.Player.mults.hacking_grow *= incMult;
            _player_1.Player.mults.hacking *= incMult;
            _player_1.Player.mults.strength *= incMult;
            _player_1.Player.mults.defense *= incMult;
            _player_1.Player.mults.dexterity *= incMult;
            _player_1.Player.mults.agility *= incMult;
            _player_1.Player.mults.charisma *= incMult;
            _player_1.Player.mults.hacking_exp *= incMult;
            _player_1.Player.mults.strength_exp *= incMult;
            _player_1.Player.mults.defense_exp *= incMult;
            _player_1.Player.mults.dexterity_exp *= incMult;
            _player_1.Player.mults.agility_exp *= incMult;
            _player_1.Player.mults.charisma_exp *= incMult;
            _player_1.Player.mults.company_rep *= incMult;
            _player_1.Player.mults.faction_rep *= incMult;
            _player_1.Player.mults.crime_money *= incMult;
            _player_1.Player.mults.crime_success *= incMult;
            _player_1.Player.mults.hacknet_node_money *= incMult;
            _player_1.Player.mults.hacknet_node_purchase_cost *= decMult;
            _player_1.Player.mults.hacknet_node_ram_cost *= decMult;
            _player_1.Player.mults.hacknet_node_core_cost *= decMult;
            _player_1.Player.mults.hacknet_node_level_cost *= decMult;
            _player_1.Player.mults.work_money *= incMult;
            break;
        }
        case 2: {
            // Rise of the Underworld
            let mult = 0;
            for (let i = 0; i < lvl; ++i) {
                mult += 24 / Math.pow(2, i);
            }
            const incMult = 1 + mult / 100;
            _player_1.Player.mults.crime_money *= incMult;
            _player_1.Player.mults.crime_success *= incMult;
            _player_1.Player.mults.charisma *= incMult;
            break;
        }
        case 3: {
            // Corporatocracy
            let mult = 0;
            for (let i = 0; i < lvl; ++i) {
                mult += 8 / Math.pow(2, i);
            }
            const incMult = 1 + mult / 100;
            _player_1.Player.mults.charisma *= incMult;
            _player_1.Player.mults.work_money *= incMult;
            break;
        }
        case 4: {
            // The Singularity
            // No effects, just gives access to Singularity functions
            break;
        }
        case 5: {
            // Artificial Intelligence
            let mult = 0;
            for (let i = 0; i < lvl; ++i) {
                mult += 8 / Math.pow(2, i);
            }
            const incMult = 1 + mult / 100;
            _player_1.Player.mults.hacking_chance *= incMult;
            _player_1.Player.mults.hacking_speed *= incMult;
            _player_1.Player.mults.hacking_money *= incMult;
            _player_1.Player.mults.hacking_grow *= incMult;
            _player_1.Player.mults.hacking *= incMult;
            _player_1.Player.mults.hacking_exp *= incMult;
            break;
        }
        case 6: {
            // Bladeburner
            let mult = 0;
            for (let i = 0; i < lvl; ++i) {
                mult += 8 / Math.pow(2, i);
            }
            const incMult = 1 + mult / 100;
            _player_1.Player.mults.strength_exp *= incMult;
            _player_1.Player.mults.defense_exp *= incMult;
            _player_1.Player.mults.dexterity_exp *= incMult;
            _player_1.Player.mults.agility_exp *= incMult;
            _player_1.Player.mults.strength *= incMult;
            _player_1.Player.mults.defense *= incMult;
            _player_1.Player.mults.dexterity *= incMult;
            _player_1.Player.mults.agility *= incMult;
            break;
        }
        case 7: {
            // Bladeburner 2079
            let mult = 0;
            for (let i = 0; i < lvl; ++i) {
                mult += 8 / Math.pow(2, i);
            }
            const incMult = 1 + mult / 100;
            _player_1.Player.mults.bladeburner_max_stamina *= incMult;
            _player_1.Player.mults.bladeburner_stamina_gain *= incMult;
            _player_1.Player.mults.bladeburner_analysis *= incMult;
            _player_1.Player.mults.bladeburner_success_chance *= incMult;
            break;
        }
        case 8: {
            // Ghost of Wall Street
            let mult = 0;
            for (let i = 0; i < lvl; ++i) {
                mult += 12 / Math.pow(2, i);
            }
            const incMult = 1 + mult / 100;
            _player_1.Player.mults.hacking_grow *= incMult;
            break;
        }
        case 9: {
            // Hacktocracy
            let mult = 0;
            for (let i = 0; i < lvl; ++i) {
                mult += 12 / Math.pow(2, i);
            }
            const incMult = 1 + mult / 100;
            const decMult = 1 - mult / 100;
            _player_1.Player.mults.hacknet_node_core_cost *= decMult;
            _player_1.Player.mults.hacknet_node_level_cost *= decMult;
            _player_1.Player.mults.hacknet_node_money *= incMult;
            _player_1.Player.mults.hacknet_node_purchase_cost *= decMult;
            _player_1.Player.mults.hacknet_node_ram_cost *= decMult;
            break;
        }
        case 10: {
            // Digital Carbon
            // No effects, just grants sleeves
            break;
        }
        case 11: {
            // The Big Crash
            let mult = 0;
            for (let i = 0; i < lvl; ++i) {
                mult += 32 / Math.pow(2, i);
            }
            const incMult = 1 + mult / 100;
            _player_1.Player.mults.work_money *= incMult;
            _player_1.Player.mults.company_rep *= incMult;
            break;
        }
        case 12: // The Recursion
            // Grants neuroflux.
            break;
        case 13: // They're Lunatics
            // Grants more space on Stanek's Gift.
            break;
        case 14: // IPvGO
            // Grands increased buffs and favor limit from IPvGO
            break;
        default:
            console.error(`Invalid source file number: ${bn}`);
            break;
    }
}
