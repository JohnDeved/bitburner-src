import { EventEmitter } from "../utils/EventEmitter";
import type { CodingContract } from "./Contract";
export type CodingContractEventData = {
    codingContract: CodingContract;
    onClose: () => void;
    onAttempt: (answer: string) => void;
};
type CodingContractEvent = {
    type: "run";
    data: CodingContractEventData;
} | {
    type: "close";
};
export declare const CodingContractEventEmitter: EventEmitter<[CodingContractEvent]>;
export {};
