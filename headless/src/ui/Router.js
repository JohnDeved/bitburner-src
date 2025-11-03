"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSimplePage = exports.Page = void 0;
const Enums_1 = require("./Enums");
exports.Page = { ...Enums_1.SimplePage, ...Enums_1.ComplexPage };
const simplePages = Object.values(Enums_1.SimplePage);
const isSimplePage = (page) => simplePages.includes(page);
exports.isSimplePage = isSimplePage;
