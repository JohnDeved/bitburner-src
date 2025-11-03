"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyBindingsSchema = void 0;
const KeyBindingUtils_1 = require("../../utils/KeyBindingUtils");
function getKeyBindingsSchemaProperties() {
    const result = {};
    for (const keyBindingType of KeyBindingUtils_1.KeyBindingTypes) {
        result[keyBindingType] = {
            type: "array",
            minItems: 2,
            items: {
                type: "object",
                nullable: true,
                properties: {
                    control: {
                        type: "boolean",
                    },
                    alt: {
                        type: "boolean",
                    },
                    shift: {
                        type: "boolean",
                    },
                    meta: {
                        type: "boolean",
                    },
                    key: {
                        type: "string",
                    },
                },
                required: ["control", "alt", "shift", "meta", "key"],
            },
        };
    }
    return result;
}
exports.KeyBindingsSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: getKeyBindingsSchemaProperties(),
};
