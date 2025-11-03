import { CorpUnlockName } from "@enums";
export interface CorpUnlock {
    name: CorpUnlockName;
    price: number;
    desc: string;
}
export declare const CorpUnlocks: Record<CorpUnlockName, CorpUnlock>;
