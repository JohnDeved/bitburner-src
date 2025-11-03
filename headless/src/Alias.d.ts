export declare const Aliases: Map<string, string>;
export declare const GlobalAliases: Map<string, string>;
export declare function loadAliases(saveString: string): void;
export declare function loadGlobalAliases(saveString: string): void;
export declare function printAliases(): void;
export declare function parseAliasDeclaration(dec: string, global?: boolean): boolean;
export declare function removeAlias(name: string): boolean;
/**
 * Returns the original string with any aliases substituted in.
 * Aliases are only applied to "whole words", one level deep
 * @param origCommand the original command string
 */
export declare function substituteAliases(origCommand: string): string;
