"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWork = startWork;
exports.processWork = processWork;
exports.finishWork = finishWork;
function startWork(w) {
    if (this.currentWork !== null) {
        this.currentWork.finish(true);
    }
    this.currentWork = w;
}
function processWork(cycles = 1) {
    if (this.currentWork === null)
        return;
    const finished = this.currentWork.process(cycles);
    if (finished) {
        this.finishWork(false);
    }
}
function finishWork(cancelled, suppressDialog) {
    if (this.currentWork === null)
        return;
    this.currentWork.finish(cancelled, !!suppressDialog);
    this.currentWork = null;
    this.focus = false;
}
