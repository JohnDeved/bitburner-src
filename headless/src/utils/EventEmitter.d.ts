/** Generic Event Emitter class following a subscribe/publish paradigm. */
export declare class EventEmitter<T extends any[]> {
    private subscribers;
    subscribe(s: (...args: [...T]) => void): () => void;
    emit(...args: [...T]): void;
    hasSubscribers(): boolean;
}
