export type ObjectValidator<T> = {
    [key in keyof T]?: ParameterValidator<T, keyof T>;
};
interface ParameterValidatorObject<Type, Key extends keyof Type> {
    default?: unknown;
    min?: number;
    max?: number;
    func?: (obj: Type, validator: ObjectValidator<Type>, key: Key) => void;
}
type ParameterValidatorFunction<Type, Key extends keyof Type> = (obj: Type, key: Key) => void;
type ParameterValidator<Type, Key extends keyof Type> = ParameterValidatorObject<Type, Key> | ParameterValidatorFunction<Type, Key>;
export declare function validateObject<Type extends Record<string, unknown>, Key extends keyof Type>(obj: Type, validator: ObjectValidator<Type>): void;
export declare function minMax<Type, Key extends keyof Type>(def: number, min: number, max: number): (obj: Type, key: Key & keyof Type) => void;
export declare function oneOf<Type, Key extends keyof Type, Value>(def: Value, options: Value[]): (obj: Type, key: Key & keyof Type) => void;
export declare function subsetOf<Type, Key extends keyof Type, Value>(options: Value[]): (obj: Type, key: Key & keyof Type) => void;
export {};
