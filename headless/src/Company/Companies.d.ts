import { Company } from "./Company";
import { CompanyName } from "./Enums";
import { PartialRecord } from "../Types/Record";
export declare const Companies: Record<CompanyName, Company>;
type SavegameCompany = {
    favor?: number;
    playerReputation?: number;
};
export declare function loadCompanies(saveString: string): void;
export declare function getCompaniesSave(): PartialRecord<CompanyName, SavegameCompany>;
export {};
