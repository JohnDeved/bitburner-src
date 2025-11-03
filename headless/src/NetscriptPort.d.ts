import { NetscriptPort } from "@nsdefs";
import { PositiveInteger } from "./types";
type Resolver = () => void;
/** The object property is for typechecking and is not present at runtime */
export type PortNumber = PositiveInteger & {
    __PortNumber: true;
};
/** Gets the numbered port, initializing it if it doesn't already exist.
 * Only using for functions that write data/resolvers. Use NetscriptPorts.get(n) for */
export declare function getPort(n: PortNumber): Port;
export declare class Port {
    data: any[];
    resolver: Resolver | null;
    promise: Promise<void> | null;
    add(data: any): void;
}
export declare function portHandle(n: PortNumber): NetscriptPort;
export declare function writePort(n: PortNumber, value: unknown): unknown;
export declare function tryWritePort(n: PortNumber, value: unknown): boolean;
export declare function readPort(n: PortNumber): unknown;
export declare function peekPort(n: PortNumber): unknown;
export declare function nextPortWrite(n: PortNumber): Promise<void>;
export declare function clearPort(n: PortNumber): void;
export {};
