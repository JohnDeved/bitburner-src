"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertAndSanitizeMainTheme = assertAndSanitizeMainTheme;
exports.assertAndSanitizeEditorTheme = assertAndSanitizeEditorTheme;
exports.assertAndSanitizeStyles = assertAndSanitizeStyles;
exports.assertAndSanitizeKeyBindings = assertAndSanitizeKeyBindings;
const JsonSchemaValidator_1 = require("./JsonSchemaValidator");
function assertAndSanitize(data, validate) {
    if (!validate(data)) {
        console.error("validate.errors:", validate.errors);
        // validate.errors is an array of objects, so we need to use JSON.stringify.
        throw new Error(JSON.stringify(validate.errors));
    }
}
/**
 * This function validates the unknown data and removes properties not defined in MainThemeSchema.
 */
function assertAndSanitizeMainTheme(data) {
    assertAndSanitize(data, JsonSchemaValidator_1.JsonSchemaValidator.MainTheme);
}
/**
 * This function validates the unknown data and removes properties not defined in EditorThemeSchema.
 */
function assertAndSanitizeEditorTheme(data) {
    assertAndSanitize(data, JsonSchemaValidator_1.JsonSchemaValidator.EditorTheme);
}
/**
 * This function validates the unknown data and removes properties not defined in StylesSchema.
 */
function assertAndSanitizeStyles(data) {
    assertAndSanitize(data, JsonSchemaValidator_1.JsonSchemaValidator.Styles);
}
/**
 * This function validates the unknown data and removes properties not defined in KeyBindingsSchema.
 */
function assertAndSanitizeKeyBindings(data) {
    assertAndSanitize(data, JsonSchemaValidator_1.JsonSchemaValidator.KeyBindingsSchema);
}
