import { Augmentation } from "../../Augmentation/Augmentation";
export interface IConstructorParams {
    augmentation: Augmentation;
    readonly cost: number;
    readonly time: number;
}
export declare class GraftableAugmentation {
    augmentation: Augmentation;
    constructor(augmentation: Augmentation);
    get cost(): number;
    get time(): number;
}
