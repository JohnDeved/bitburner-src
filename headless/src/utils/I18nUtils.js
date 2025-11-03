"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluralize = pluralize;
const pluralRules = new Intl.PluralRules("en-US");
function pluralize(count, singular, plural, skipCountInReturnedValue = false) {
    const countText = !skipCountInReturnedValue ? `${count} ` : "";
    const pluralRule = pluralRules.select(count);
    if (pluralRule === "one") {
        return countText + singular;
    }
    return countText + (plural !== undefined ? plural : `${singular}s`);
}
