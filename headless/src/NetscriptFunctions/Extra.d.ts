import { InternalAPI } from "../Netscript/APIWrapper";
export interface INetscriptExtra {
    openDevMenu(): void;
    exploit(): void;
    bypass(doc: Document): void;
    alterReality(): void;
    rainbow(guess: string): void;
}
export declare function NetscriptExtra(): InternalAPI<INetscriptExtra>;
