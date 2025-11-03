export type PromisePair<ReturnType> = {
    promise: Promise<ReturnType> | null;
    resolve: ((value: ReturnType) => void) | null;
};
