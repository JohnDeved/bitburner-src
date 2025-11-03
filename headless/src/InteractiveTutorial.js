"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITutorial = exports.iTutorialSteps = void 0;
exports.iTutorialEnd = iTutorialEnd;
exports.iTutorialStart = iTutorialStart;
exports.iTutorialNextStep = iTutorialNextStep;
exports.iTutorialPrevStep = iTutorialPrevStep;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const ITutorialEvents_1 = require("./ui/InteractiveTutorial/ITutorialEvents");
// Ordered array of keys to Interactive Tutorial Steps
var iTutorialSteps;
(function (iTutorialSteps) {
    iTutorialSteps[iTutorialSteps["Start"] = 0] = "Start";
    iTutorialSteps[iTutorialSteps["GoToCharacterPage"] = 1] = "GoToCharacterPage";
    iTutorialSteps[iTutorialSteps["CharacterPage"] = 2] = "CharacterPage";
    iTutorialSteps[iTutorialSteps["CharacterGoToTerminalPage"] = 3] = "CharacterGoToTerminalPage";
    iTutorialSteps[iTutorialSteps["TerminalIntro"] = 4] = "TerminalIntro";
    iTutorialSteps[iTutorialSteps["TerminalHelp"] = 5] = "TerminalHelp";
    iTutorialSteps[iTutorialSteps["TerminalLs"] = 6] = "TerminalLs";
    iTutorialSteps[iTutorialSteps["TerminalScan"] = 7] = "TerminalScan";
    iTutorialSteps[iTutorialSteps["TerminalScanAnalyze1"] = 8] = "TerminalScanAnalyze1";
    iTutorialSteps[iTutorialSteps["TerminalScanAnalyze2"] = 9] = "TerminalScanAnalyze2";
    iTutorialSteps[iTutorialSteps["TerminalConnect"] = 10] = "TerminalConnect";
    iTutorialSteps[iTutorialSteps["TerminalAnalyze"] = 11] = "TerminalAnalyze";
    iTutorialSteps[iTutorialSteps["TerminalNuke"] = 12] = "TerminalNuke";
    iTutorialSteps[iTutorialSteps["TerminalManualHack"] = 13] = "TerminalManualHack";
    iTutorialSteps[iTutorialSteps["TerminalHackingMechanics"] = 14] = "TerminalHackingMechanics";
    iTutorialSteps[iTutorialSteps["TerminalGoHome"] = 15] = "TerminalGoHome";
    iTutorialSteps[iTutorialSteps["TerminalCreateScript"] = 16] = "TerminalCreateScript";
    iTutorialSteps[iTutorialSteps["TerminalEditScript"] = 17] = "TerminalEditScript";
    iTutorialSteps[iTutorialSteps["TerminalFree"] = 18] = "TerminalFree";
    iTutorialSteps[iTutorialSteps["TerminalRunScript"] = 19] = "TerminalRunScript";
    iTutorialSteps[iTutorialSteps["TerminalGoToActiveScriptsPage"] = 20] = "TerminalGoToActiveScriptsPage";
    iTutorialSteps[iTutorialSteps["ActiveScriptsPage"] = 21] = "ActiveScriptsPage";
    iTutorialSteps[iTutorialSteps["ActiveScriptsToTerminal"] = 22] = "ActiveScriptsToTerminal";
    iTutorialSteps[iTutorialSteps["TerminalTailScript"] = 23] = "TerminalTailScript";
    iTutorialSteps[iTutorialSteps["GoToHacknetNodesPage"] = 24] = "GoToHacknetNodesPage";
    iTutorialSteps[iTutorialSteps["HacknetNodesIntroduction"] = 25] = "HacknetNodesIntroduction";
    iTutorialSteps[iTutorialSteps["HacknetNodesGoToWorldPage"] = 26] = "HacknetNodesGoToWorldPage";
    iTutorialSteps[iTutorialSteps["WorldDescription"] = 27] = "WorldDescription";
    iTutorialSteps[iTutorialSteps["DocumentationPageInfo"] = 28] = "DocumentationPageInfo";
    iTutorialSteps[iTutorialSteps["End"] = 29] = "End";
})(iTutorialSteps || (exports.iTutorialSteps = iTutorialSteps = {}));
const ITutorial = {
    currStep: iTutorialSteps.Start,
    isRunning: false,
    // Keeps track of whether each step has been done
    stepIsDone: {
        [iTutorialSteps.Start]: false,
        [iTutorialSteps.GoToCharacterPage]: false,
        [iTutorialSteps.CharacterPage]: false,
        [iTutorialSteps.CharacterGoToTerminalPage]: false,
        [iTutorialSteps.TerminalIntro]: false,
        [iTutorialSteps.TerminalHelp]: false,
        [iTutorialSteps.TerminalLs]: false,
        [iTutorialSteps.TerminalScan]: false,
        [iTutorialSteps.TerminalScanAnalyze1]: false,
        [iTutorialSteps.TerminalScanAnalyze2]: false,
        [iTutorialSteps.TerminalConnect]: false,
        [iTutorialSteps.TerminalAnalyze]: false,
        [iTutorialSteps.TerminalNuke]: false,
        [iTutorialSteps.TerminalManualHack]: false,
        [iTutorialSteps.TerminalHackingMechanics]: false,
        [iTutorialSteps.TerminalGoHome]: false,
        [iTutorialSteps.TerminalCreateScript]: false,
        [iTutorialSteps.TerminalEditScript]: false,
        [iTutorialSteps.TerminalFree]: false,
        [iTutorialSteps.TerminalRunScript]: false,
        [iTutorialSteps.TerminalGoToActiveScriptsPage]: false,
        [iTutorialSteps.ActiveScriptsPage]: false,
        [iTutorialSteps.ActiveScriptsToTerminal]: false,
        [iTutorialSteps.TerminalTailScript]: false,
        [iTutorialSteps.GoToHacknetNodesPage]: false,
        [iTutorialSteps.HacknetNodesIntroduction]: false,
        [iTutorialSteps.HacknetNodesGoToWorldPage]: false,
        [iTutorialSteps.WorldDescription]: false,
        [iTutorialSteps.DocumentationPageInfo]: false,
        [iTutorialSteps.End]: false,
    },
};
exports.ITutorial = ITutorial;
function iTutorialStart() {
    ITutorial.isRunning = true;
    ITutorial.currStep = iTutorialSteps.Start;
}
// Go to the next step and evaluate it
function iTutorialNextStep() {
    ITutorial.stepIsDone[ITutorial.currStep] = true;
    if (ITutorial.currStep < iTutorialSteps.End) {
        ITutorial.currStep += 1;
    }
    if (ITutorial.currStep === iTutorialSteps.End)
        iTutorialEnd();
    ITutorialEvents_1.ITutorialEvents.emit();
}
// Go to previous step and evaluate
function iTutorialPrevStep() {
    if (ITutorial.currStep > iTutorialSteps.Start) {
        ITutorial.currStep -= 1;
    }
    ITutorialEvents_1.ITutorialEvents.emit();
}
function iTutorialEnd() {
    ITutorial.isRunning = false;
    ITutorial.currStep = iTutorialSteps.Start;
    const messages = _player_1.Player.getHomeComputer().messages;
    const handbook = _enums_1.LiteratureName.HackersStartingHandbook;
    if (!messages.includes(handbook))
        messages.push(handbook);
    ITutorialEvents_1.ITutorialEvents.emit();
}
