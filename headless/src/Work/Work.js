"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkType = exports.Work = void 0;
class Work {
    constructor(type, singularity) {
        this.type = type;
        this.singularity = singularity;
        this.cyclesWorked = 0;
    }
}
exports.Work = Work;
var WorkType;
(function (WorkType) {
    WorkType["CRIME"] = "CRIME";
    WorkType["CLASS"] = "CLASS";
    WorkType["CREATE_PROGRAM"] = "CREATE_PROGRAM";
    WorkType["GRAFTING"] = "GRAFTING";
    WorkType["FACTION"] = "FACTION";
    WorkType["COMPANY"] = "COMPANY";
})(WorkType || (exports.WorkType = WorkType = {}));
