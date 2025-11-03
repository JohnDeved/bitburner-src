import type { FragmentType } from "@nsdefs";
export declare const Fragments: Fragment[];
export declare class Fragment {
    id: number;
    shape: boolean[][];
    type: FragmentType;
    power: number;
    limit: number;
    effect: string;
    constructor(id: number, shape: boolean[][], type: FragmentType, power: number, limit: number, effect: string);
    fullAt(x: number, y: number, rotation: number): boolean;
    width(rotation: number): number;
    height(rotation: number): number;
    neighbors(rotation: number): number[][];
    copy(): Fragment;
}
export declare function FragmentById(id: number): Fragment | null;
