import { CorpStateName } from "@nsdefs";
import { IReviverValue } from "../utils/JSONReviver";
export declare class CorporationState {
    state: number;
    get nextName(): CorpStateName;
    get prevName(): CorpStateName;
    incrementState(): void;
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): CorporationState;
}
