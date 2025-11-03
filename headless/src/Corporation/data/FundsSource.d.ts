declare const FundsSourceLongTerm: readonly ["product development", "office", "warehouse", "upgrades", "bribery", "public equity", "private equity", "hacknet", "force majeure"];
type FundsSourceShortTerm = "division" | "operating expenses" | "operating revenue" | "dividends" | "tea" | "parties" | "advert" | "materials" | "glitch in reality";
export type FundsSource = (typeof FundsSourceLongTerm)[number] | FundsSourceShortTerm;
export declare const LongTermFundsSources: Set<FundsSource>;
export {};
