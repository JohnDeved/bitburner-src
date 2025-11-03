declare enum iTutorialSteps {
    Start = 0,
    GoToCharacterPage = 1,// Click on 'Stats' page
    CharacterPage = 2,// Introduction to 'Stats' page
    CharacterGoToTerminalPage = 3,// Go back to Terminal
    TerminalIntro = 4,// Introduction to Terminal
    TerminalHelp = 5,// Using 'help' Terminal command
    TerminalLs = 6,// Using 'ls' Terminal command
    TerminalScan = 7,// Using 'scan' Terminal command
    TerminalScanAnalyze1 = 8,// Using 'scan-analyze' Terminal command
    TerminalScanAnalyze2 = 9,// Using 'scan-analyze 3' Terminal command
    TerminalConnect = 10,// Connecting to n00dles
    TerminalAnalyze = 11,// Analyzing n00dles
    TerminalNuke = 12,// NUKE n00dles
    TerminalManualHack = 13,// Hack n00dles
    TerminalHackingMechanics = 14,// Explanation of hacking mechanics
    TerminalGoHome = 15,// Go home before creating a script.
    TerminalCreateScript = 16,// Create a script using 'nano'
    TerminalEditScript = 17,// Script Editor page - Edit script and then save & close
    TerminalFree = 18,// Using 'Free' Terminal command
    TerminalRunScript = 19,// Running script using 'run' Terminal command
    TerminalGoToActiveScriptsPage = 20,
    ActiveScriptsPage = 21,
    ActiveScriptsToTerminal = 22,
    TerminalTailScript = 23,
    GoToHacknetNodesPage = 24,
    HacknetNodesIntroduction = 25,
    HacknetNodesGoToWorldPage = 26,
    WorldDescription = 27,
    DocumentationPageInfo = 28,
    End = 29
}
declare const ITutorial: {
    currStep: iTutorialSteps;
    isRunning: boolean;
    stepIsDone: {
        0: boolean;
        1: boolean;
        2: boolean;
        3: boolean;
        4: boolean;
        5: boolean;
        6: boolean;
        7: boolean;
        8: boolean;
        9: boolean;
        10: boolean;
        11: boolean;
        12: boolean;
        13: boolean;
        14: boolean;
        15: boolean;
        16: boolean;
        17: boolean;
        18: boolean;
        19: boolean;
        20: boolean;
        21: boolean;
        22: boolean;
        23: boolean;
        24: boolean;
        25: boolean;
        26: boolean;
        27: boolean;
        28: boolean;
        29: boolean;
    };
};
declare function iTutorialStart(): void;
declare function iTutorialNextStep(): void;
declare function iTutorialPrevStep(): void;
declare function iTutorialEnd(): void;
export { iTutorialSteps, iTutorialEnd, iTutorialStart, iTutorialNextStep, ITutorial, iTutorialPrevStep };
