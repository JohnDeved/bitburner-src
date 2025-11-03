import { EventEmitter } from "../utils/EventEmitter";
export declare enum UIEventType {
    MainUILoaded = 0
}
export declare const UIEventEmitter: EventEmitter<UIEventType[]>;
