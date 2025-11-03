"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEntropy = void 0;
const Constants_1 = require("../../Constants");
const _player_1 = require("@player");
const calculateEntropy = (stacks = 1) => {
    const nerf = Constants_1.CONSTANTS.EntropyEffect ** stacks;
    return {
        hacking_chance: _player_1.Player.mults.hacking_chance * nerf,
        hacking_speed: _player_1.Player.mults.hacking_speed * nerf,
        hacking_money: _player_1.Player.mults.hacking_money * nerf,
        hacking_grow: _player_1.Player.mults.hacking_grow * nerf,
        hacking: _player_1.Player.mults.hacking * nerf,
        strength: _player_1.Player.mults.strength * nerf,
        defense: _player_1.Player.mults.defense * nerf,
        dexterity: _player_1.Player.mults.dexterity * nerf,
        agility: _player_1.Player.mults.agility * nerf,
        charisma: _player_1.Player.mults.charisma * nerf,
        hacking_exp: _player_1.Player.mults.hacking_exp * nerf,
        strength_exp: _player_1.Player.mults.strength_exp * nerf,
        defense_exp: _player_1.Player.mults.defense_exp * nerf,
        dexterity_exp: _player_1.Player.mults.dexterity_exp * nerf,
        agility_exp: _player_1.Player.mults.agility_exp * nerf,
        charisma_exp: _player_1.Player.mults.charisma_exp * nerf,
        company_rep: _player_1.Player.mults.company_rep * nerf,
        faction_rep: _player_1.Player.mults.faction_rep * nerf,
        crime_money: _player_1.Player.mults.crime_money * nerf,
        crime_success: _player_1.Player.mults.crime_success * nerf,
        hacknet_node_money: _player_1.Player.mults.hacknet_node_money * nerf,
        hacknet_node_purchase_cost: _player_1.Player.mults.hacknet_node_purchase_cost / nerf,
        hacknet_node_ram_cost: _player_1.Player.mults.hacknet_node_ram_cost / nerf,
        hacknet_node_core_cost: _player_1.Player.mults.hacknet_node_core_cost / nerf,
        hacknet_node_level_cost: _player_1.Player.mults.hacknet_node_level_cost / nerf,
        work_money: _player_1.Player.mults.work_money * nerf,
        bladeburner_max_stamina: _player_1.Player.mults.bladeburner_max_stamina * nerf,
        bladeburner_stamina_gain: _player_1.Player.mults.bladeburner_stamina_gain * nerf,
        bladeburner_analysis: _player_1.Player.mults.bladeburner_analysis * nerf,
        bladeburner_success_chance: _player_1.Player.mults.bladeburner_success_chance * nerf,
    };
};
exports.calculateEntropy = calculateEntropy;
