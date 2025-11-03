import { CompanyName, JobName } from "@enums";
import { IReviverValue } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { SleeveWorkClass, SleeveWorkType } from "./Work";
import { Company } from "../../../Company/Company";
import { WorkStats } from "../../../Work/WorkStats";
export declare const isSleeveCompanyWork: (w: SleeveWorkClass | null) => w is SleeveCompanyWork;
export declare class SleeveCompanyWork extends SleeveWorkClass {
    type: SleeveWorkType.COMPANY;
    companyName: CompanyName;
    constructor(companyName?: any);
    getCompany(): Company;
    getGainRates(sleeve: Sleeve, job: JobName): WorkStats;
    process(sleeve: Sleeve, cycles: number): void;
    APICopy(): {
        type: SleeveWorkType.COMPANY;
        companyName: CompanyName;
    };
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a CompanyWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): SleeveCompanyWork;
}
