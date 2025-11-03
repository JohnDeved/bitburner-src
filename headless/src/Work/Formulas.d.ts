import { Crime } from "../Crime/Crime";
import { WorkStats } from "./WorkStats";
import { Person as IPerson } from "@nsdefs";
import { ClassType, FactionWorkType, LocationName } from "@enums";
import { Location } from "../Locations/Location";
import { Class } from "./ClassWork";
import { Company } from "../Company/Company";
import { CompanyPosition } from "../Company/CompanyPosition";
export declare const FactionWorkStats: Record<FactionWorkType, WorkStats>;
export declare function calculateCrimeWorkStats(person: IPerson, crime: Crime): WorkStats;
/** @returns faction rep rate per cycle */
export declare const calculateFactionRep: (person: IPerson, type: FactionWorkType, favor: number) => number;
/** @returns per-cycle WorkStats */
export declare function calculateFactionExp(person: IPerson, type: FactionWorkType): WorkStats;
/** Calculate cost for a class */
export declare function calculateCost(classs: Class, location: Location): number;
/** @returns per-cycle WorkStats */
export declare function calculateClassEarnings(person: IPerson, type: ClassType, locationName: LocationName): WorkStats;
/** @returns per-cycle WorkStats */
export declare const calculateCompanyWorkStats: (worker: IPerson, company: Company, companyPosition: CompanyPosition, favor: number) => WorkStats;
