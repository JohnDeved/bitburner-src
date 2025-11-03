import { EventEmitter } from "../../utils/EventEmitter";
export declare enum PlayerEventType {
    Hospitalized = 0
}
export declare const PlayerEvents: EventEmitter<[PlayerEventType]>;
