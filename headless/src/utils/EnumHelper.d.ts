import type { Member } from "../types";
import type { NetscriptContext } from "../Netscript/APIWrapper";
import * as allEnums from "../Enums";
interface GetMemberOptions {
    /** Whether to use fuzzy matching on the input (case insensitive, ignore spaces and dashes) */
    fuzzy?: boolean;
    /** Whether to always return an enum member, even if there was no match. Will attempt fuzzy match before returning a default match. */
    alwaysMatch?: boolean;
}
declare class EnumHelper<EnumObj extends object, EnumMember extends Member<EnumObj> & string> {
    name: string;
    defaultArgName: string;
    valueArray: Array<EnumMember>;
    valueSet: Set<EnumMember>;
    fuzzMap: Map<string, EnumMember>;
    constructor(obj: EnumObj, name: string);
    /** Provide a boolean indication for whether a value is a member of an enum */
    isMember(toValidate: unknown): toValidate is EnumMember;
    /** Take an unknown input from a player script, either return an enum member or throw */
    nsGetMember(ctx: NetscriptContext, toValidate: unknown, argName?: string, options?: GetMemberOptions): EnumMember;
    getMember(input: unknown, options: {
        alwaysMatch: true;
    }): EnumMember;
    getMember(input: unknown, options?: GetMemberOptions): EnumMember | undefined;
    random(): EnumMember;
}
type EnumName = keyof typeof allEnums;
export declare const getEnumHelper: <Name extends EnumName, Enum extends (typeof allEnums)[Name]>(name: Name) => EnumHelper<Enum, Member<Enum>>;
export declare const isMember: <Name extends EnumName, Enum extends (typeof allEnums)[Name]>(name: Name, value: unknown) => value is Member<Enum>;
export {};
