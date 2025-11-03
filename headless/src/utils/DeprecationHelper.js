"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDeprecatedProperties = setDeprecatedProperties;
exports.deprecationWarning = deprecationWarning;
const Terminal_1 = require("../Terminal");
const deprecatedWarningsGiven = new Set();
function setDeprecatedProperties(obj, properties) {
    for (const [name, info] of Object.entries(properties)) {
        Object.defineProperty(obj, name, {
            get: () => {
                deprecationWarning(info.identifier, info.message);
                return info.value;
            },
            set: (value) => (info.value = value),
            enumerable: true,
        });
    }
}
function deprecationWarning(identifier, message) {
    if (!deprecatedWarningsGiven.has(identifier)) {
        deprecatedWarningsGiven.add(identifier);
        Terminal_1.Terminal.warn(`Accessed deprecated function or property: ${identifier}`);
        Terminal_1.Terminal.warn(`This is no longer supported usage and will be removed in a later version.`);
        Terminal_1.Terminal.warn(message);
        Terminal_1.Terminal.info(`This message can also appear for object properties when the object's values are iterated.`);
        Terminal_1.Terminal.info(`This message will only be shown once per game session for each deprecated item accessed.`);
    }
}
