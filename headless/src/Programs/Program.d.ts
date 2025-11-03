import type { CompletedProgramName } from "@enums";
import { ProgramFilePath } from "../Paths/ProgramFilePath";
import { BaseServer } from "../Server/BaseServer";
export interface IProgramCreate {
    level: number;
    req(): boolean;
    time: number;
    tooltip: string;
}
interface ProgramConstructorParams {
    name: CompletedProgramName;
    create: IProgramCreate | null;
    run: (args: string[], server: BaseServer) => void;
}
export declare class Program {
    name: ProgramFilePath & CompletedProgramName;
    create: IProgramCreate | null;
    run: (args: string[], server: BaseServer) => void;
    constructor({ name, create, run }: ProgramConstructorParams);
}
export {};
