import { ITaskParams, ITerritory } from "./ITaskParams";
export declare class GangMemberTask {
    name: string;
    desc: string;
    isHacking: boolean;
    isCombat: boolean;
    baseRespect: number;
    baseWanted: number;
    baseMoney: number;
    hackWeight: number;
    strWeight: number;
    defWeight: number;
    dexWeight: number;
    agiWeight: number;
    chaWeight: number;
    difficulty: number;
    territory: ITerritory;
    constructor(name: string, desc: string, isHacking: boolean, isCombat: boolean, params: ITaskParams);
}
