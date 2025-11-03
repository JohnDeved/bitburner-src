import { type NSFull } from "../../src/NetscriptFunctions";
import type { NetscriptContext } from "../../src/Netscript/APIWrapper";
export declare function fixDoImportIssue(): void;
export declare function initGameEnvironment(): void;
export declare function setupBasicTestingEnvironment(): void;
export declare function getNS(): NSFull;
export declare function getMockedNetscriptContext(workerScriptLogFunction?: (func: string, txt: () => string) => void): NetscriptContext;
