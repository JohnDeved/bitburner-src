"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProgramWork = exports.isCreateProgramWork = void 0;
const DialogBox_1 = require("../ui/React/DialogBox");
const JSONReviver_1 = require("../utils/JSONReviver");
const _enums_1 = require("@enums");
const Constants_1 = require("../Constants");
const _player_1 = require("@player");
const Programs_1 = require("../Programs/Programs");
const Work_1 = require("./Work");
const intelligence_1 = require("../PersonObjects/formulas/intelligence");
const ProgramFilePath_1 = require("../Paths/ProgramFilePath");
const isCreateProgramWork = (w) => w !== null && w.type === Work_1.WorkType.CREATE_PROGRAM;
exports.isCreateProgramWork = isCreateProgramWork;
class CreateProgramWork extends Work_1.Work {
    constructor(params) {
        super(Work_1.WorkType.CREATE_PROGRAM, params?.singularity ?? true);
        this.unitCompleted = 0;
        this.unitRate = 0;
        this.programName = params?.programName ?? _enums_1.CompletedProgramName.bruteSsh;
        if (params) {
            for (let i = 0; i < _player_1.Player.getHomeComputer().programs.length; ++i) {
                const programFile = _player_1.Player.getHomeComputer().programs[i];
                if (programFile.startsWith(this.programName) && programFile.endsWith("%-INC")) {
                    const res = programFile.split("-");
                    if (res.length != 3) {
                        break;
                    }
                    const percComplete = Number(res[1].slice(0, -1));
                    if (isNaN(percComplete) || percComplete < 0 || percComplete >= 100) {
                        break;
                    }
                    this.unitCompleted = (percComplete / 100) * this.unitNeeded();
                    _player_1.Player.getHomeComputer().programs.splice(i, 1);
                }
            }
        }
    }
    unitNeeded() {
        return this.getProgram().create?.time ?? 0;
    }
    getProgram() {
        return Programs_1.Programs[this.programName];
    }
    process(cycles) {
        const focusBonus = _player_1.Player.focusPenalty();
        //Higher hacking skill will allow you to create programs faster
        const reqLvl = this.getProgram().create?.level ?? 0;
        let skillMult = (_player_1.Player.skills.hacking / reqLvl) * (0, intelligence_1.calculateIntelligenceBonus)(_player_1.Player.skills.intelligence, 3); //This should always be greater than 1;
        skillMult = 1 + (skillMult - 1) / 5; //The divider constant can be adjusted as necessary
        skillMult *= focusBonus;
        //Skill multiplier directly applied to "time worked"
        this.cyclesWorked += cycles;
        this.unitRate = Constants_1.CONSTANTS.MilliPerCycle * skillMult;
        this.unitCompleted += this.unitRate * cycles;
        if (this.unitCompleted >= this.unitNeeded()) {
            return true;
        }
        return false;
    }
    finish(cancelled, suppressDialog) {
        const programName = (0, ProgramFilePath_1.asProgramFilePath)(this.programName);
        if (!cancelled) {
            //Complete case
            _player_1.Player.gainIntelligenceExp((Constants_1.CONSTANTS.IntelligenceProgramBaseExpGain * this.cyclesWorked * Constants_1.CONSTANTS.MilliPerCycle) / 1000);
            if (!this.singularity && !suppressDialog) {
                const lines = [
                    `You've finished creating ${programName}!`,
                    "The new program can be found on your home computer.",
                ];
                (0, DialogBox_1.dialogBoxCreate)(lines.join("\n"));
            }
            _player_1.Player.getHomeComputer().pushProgram(programName);
        }
        else if (!_player_1.Player.getHomeComputer().programs.includes(programName)) {
            //Incomplete case
            const perc = ((100 * this.unitCompleted) / this.unitNeeded()).toFixed(2);
            const incompleteName = (0, ProgramFilePath_1.asProgramFilePath)(programName + "-" + perc + "%-INC");
            _player_1.Player.getHomeComputer().pushProgram(incompleteName);
        }
    }
    APICopy() {
        return {
            type: Work_1.WorkType.CREATE_PROGRAM,
            cyclesWorked: this.cyclesWorked,
            programName: this.programName,
        };
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("CreateProgramWork", this);
    }
    /** Initializes a CreateProgramWork object from a JSON save state. */
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(CreateProgramWork, value.data);
    }
}
exports.CreateProgramWork = CreateProgramWork;
JSONReviver_1.constructorsForReviver.CreateProgramWork = CreateProgramWork;
