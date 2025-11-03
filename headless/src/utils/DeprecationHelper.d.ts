export declare function setDeprecatedProperties(obj: object, properties: Record<string, {
    identifier: string;
    message: string;
    value: unknown;
}>): void;
export declare function deprecationWarning(identifier: string, message: string): void;
