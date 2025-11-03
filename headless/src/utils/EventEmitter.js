"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
/** Generic Event Emitter class following a subscribe/publish paradigm. */
class EventEmitter {
    constructor() {
        this.subscribers = new Set();
    }
    subscribe(s) {
        this.subscribers.add(s);
        return () => {
            this.subscribers.delete(s);
        };
    }
    emit(...args) {
        for (const sub of this.subscribers) {
            sub(...args);
        }
    }
    hasSubscribers() {
        return this.subscribers.size > 0;
    }
}
exports.EventEmitter = EventEmitter;
