import { type BitNodeOptions } from "@nsdefs";
export declare function isBitNodeFinished(): boolean;
export declare function canAccessBitNodeFeature(bitNode: number): boolean;
export declare function knowAboutBitverse(): boolean;
export declare function getDefaultBitNodeOptions(): BitNodeOptions;
export declare function validateSourceFileOverrides(sourceFileOverrides: Map<number, number>, isDataFromPlayer: boolean): {
    valid: boolean;
    message?: string;
};
export declare function setBitNodeOptions(bitNodeOptions: BitNodeOptions): void;
/**
 * This function only sets the backdoorInstalled flag of the WD server. The caller must call Router.toPage() to route
 * the UI to the BitVerse page. Importing Router from src\ui\GameRoot.tsx brings too many unnecessary dependencies to
 * this utility file.
 */
export declare function finishBitNode(): void;
