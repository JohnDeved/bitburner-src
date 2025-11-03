"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StylesSchema = void 0;
exports.StylesSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
        lineHeight: {
            type: "number",
        },
        fontSize: {
            type: "number",
        },
        tailFontSize: {
            type: "number",
        },
        fontFamily: {
            type: "string",
        },
    },
};
