import { BladeburnerOperationName } from "@enums";
import { Operation } from "../Actions/Operation";
export declare function createOperations(): Record<BladeburnerOperationName, Operation>;
export declare function loadOperationsData(data: unknown, operations: Record<BladeburnerOperationName, Operation>): void;
