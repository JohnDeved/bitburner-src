import { CorpIndustryData } from "@nsdefs";
import { IndustryType } from "@enums";
export declare const IndustriesData: Record<IndustryType, CorpIndustryData>;
export declare const IndustryStartingCosts: {};
export declare const IndustryResearchTrees: Record<string, import("../ResearchTree").ResearchTree>;
export declare function resetIndustryResearchTrees(): void;
