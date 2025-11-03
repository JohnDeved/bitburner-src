import type React from "react";
import type { Page } from "../ui/Router";
declare enum GameEnv {
    Production = 0,
    Development = 1
}
declare enum Platform {
    Browser = 0,
    Steam = 1
}
interface GameVersion {
    version: string;
    commitHash: string;
    toDisplay: () => string;
}
interface BrowserFeatures {
    userAgent: string;
    language: string;
    cookiesEnabled: boolean;
    doNotTrack: string | null;
    indexedDb: boolean;
}
interface CrashReportMetadata {
    error: Record<string, unknown>;
    reactErrorInfo?: React.ErrorInfo;
    page?: Page;
    environment: GameEnv;
    platform: Platform;
    version: GameVersion;
    browserFeatures: BrowserFeatures;
}
export interface CrashReport {
    metadata: CrashReportMetadata;
    title: string;
    body: string;
    issueUrl: string;
}
export declare const newIssueUrl = "https://github.com/bitburner-official/bitburner-src/issues/new";
export declare function parseUnknownError(error: unknown): {
    errorAsString: string;
    stack?: string;
    causeAsString?: string;
    causeStack?: string;
};
export declare function getErrorMessageWithStackAndCause(error: unknown, prefix?: string): string;
export declare function getCrashReportMetadata(error: unknown, reactErrorInfo?: React.ErrorInfo, page?: Page): CrashReportMetadata;
export declare function getCrashReport(error: unknown, reactErrorInfo?: React.ErrorInfo, page?: Page): CrashReport;
export {};
