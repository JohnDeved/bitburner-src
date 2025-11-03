"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cities = void 0;
const City_1 = require("./City");
const _enums_1 = require("@enums");
const Record_1 = require("../Types/Record");
exports.Cities = (0, Record_1.createEnumKeyedRecord)(_enums_1.CityName, (name) => new City_1.City(name));
