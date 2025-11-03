import { Person as IPerson, Server as IServer } from "@nsdefs";
export declare function calculateServerGrowthLog(server: IServer, threads: number, p: IPerson, cores?: number): number;
export declare function calculateServerGrowth(server: IServer, threads: number, p: IPerson, cores?: number): number;
export declare function calculateGrowMoney(server: IServer, threads: number, p: IPerson, cores?: number): number;
