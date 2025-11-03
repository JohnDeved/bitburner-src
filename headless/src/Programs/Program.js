"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const ProgramFilePath_1 = require("../Paths/ProgramFilePath");
class Program {
    constructor({ name, create, run }) {
        this.name = (0, ProgramFilePath_1.asProgramFilePath)(name);
        this.create = create;
        this.run = run;
    }
}
exports.Program = Program;
