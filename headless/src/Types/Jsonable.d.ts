import type { IReviverValue } from "../utils/JSONReviver";
export declare class JSONSet<T> extends Set<T> {
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): JSONSet<any>;
}
export declare class JSONMap<K, __V> extends Map<K, __V> {
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): JSONMap<any, any>;
}
