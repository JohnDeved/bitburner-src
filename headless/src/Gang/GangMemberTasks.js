"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GangMemberTasks = void 0;
const tasks_1 = require("./data/tasks");
const GangMemberTask_1 = require("./GangMemberTask");
exports.GangMemberTasks = {};
(function () {
    tasks_1.gangMemberTasksMetadata.forEach((e) => {
        exports.GangMemberTasks[e.name] = new GangMemberTask_1.GangMemberTask(e.name, e.desc, e.isHacking, e.isCombat, e.params);
    });
})();
