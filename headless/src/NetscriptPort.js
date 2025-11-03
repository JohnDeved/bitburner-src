"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Port = void 0;
exports.getPort = getPort;
exports.portHandle = portHandle;
exports.writePort = writePort;
exports.tryWritePort = tryWritePort;
exports.readPort = readPort;
exports.peekPort = peekPort;
exports.nextPortWrite = nextPortWrite;
exports.clearPort = clearPort;
const Settings_1 = require("./Settings/Settings");
const NetscriptWorker_1 = require("./NetscriptWorker");
const emptyPortData = "NULL PORT DATA";
function isObjectLike(value) {
    return (typeof value === "object" && value !== null) || typeof value === "function";
}
/** Gets the numbered port, initializing it if it doesn't already exist.
 * Only using for functions that write data/resolvers. Use NetscriptPorts.get(n) for */
function getPort(n) {
    let port = NetscriptWorker_1.NetscriptPorts.get(n);
    if (port)
        return port;
    port = new Port();
    NetscriptWorker_1.NetscriptPorts.set(n, port);
    return port;
}
class Port {
    constructor() {
        this.data = [];
        this.resolver = null;
        this.promise = null;
    }
    add(data) {
        this.data.push(data);
        if (!this.resolver)
            return;
        this.resolver();
        this.resolver = null;
        this.promise = null;
    }
}
exports.Port = Port;
function portHandle(n) {
    return {
        write: (value) => writePort(n, value),
        tryWrite: (value) => tryWritePort(n, value),
        read: () => readPort(n),
        peek: () => peekPort(n),
        nextWrite: () => nextPortWrite(n),
        full: () => isFullPort(n),
        empty: () => isEmptyPort(n),
        clear: () => clearPort(n),
    };
}
function writePort(n, value) {
    const port = getPort(n);
    // Primitives don't need to be cloned.
    port.add(isObjectLike(value) ? structuredClone(value) : value);
    if (port.data.length > Settings_1.Settings.MaxPortCapacity)
        return port.data.shift();
    return null;
}
function tryWritePort(n, value) {
    const port = getPort(n);
    if (port.data.length >= Settings_1.Settings.MaxPortCapacity)
        return false;
    // Primitives don't need to be cloned.
    port.add(isObjectLike(value) ? structuredClone(value) : value);
    return true;
}
function readPort(n) {
    const port = NetscriptWorker_1.NetscriptPorts.get(n);
    if (!port || !port.data.length)
        return emptyPortData;
    const returnVal = port.data.shift();
    if (!port.data.length && !port.resolver)
        NetscriptWorker_1.NetscriptPorts.delete(n);
    return returnVal;
}
function peekPort(n) {
    const port = NetscriptWorker_1.NetscriptPorts.get(n);
    if (!port || !port.data.length)
        return emptyPortData;
    // Needed to avoid exposing internal objects.
    return isObjectLike(port.data[0]) ? structuredClone(port.data[0]) : port.data[0];
}
function nextPortWrite(n) {
    const port = getPort(n);
    if (!port.promise)
        port.promise = new Promise((res) => (port.resolver = res));
    return port.promise;
}
function isFullPort(n) {
    const port = NetscriptWorker_1.NetscriptPorts.get(n);
    if (!port)
        return false;
    return port.data.length >= Settings_1.Settings.MaxPortCapacity;
}
function isEmptyPort(n) {
    const port = NetscriptWorker_1.NetscriptPorts.get(n);
    if (!port)
        return true;
    return port.data.length === 0;
}
function clearPort(n) {
    const port = NetscriptWorker_1.NetscriptPorts.get(n);
    if (!port)
        return;
    if (!port.resolver)
        NetscriptWorker_1.NetscriptPorts.delete(n);
    port.data.length = 0;
}
