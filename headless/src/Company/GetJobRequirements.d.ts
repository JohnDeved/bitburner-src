import { Company } from "./Company";
import { CompanyPosition } from "./CompanyPosition";
import { PlayerCondition } from "../Faction/FactionJoinCondition";
export declare function getJobRequirements(company: Company, pos: CompanyPosition): PlayerCondition[];
/** Returns a string with the given CompanyPosition's stat requirements */
export declare function getJobRequirementText(company: Company, pos: CompanyPosition): string;
