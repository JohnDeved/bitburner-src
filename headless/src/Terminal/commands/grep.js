"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grep = grep;
const Terminal_1 = require("../../Terminal");
const TextFilePath_1 = require("../../Paths/TextFilePath");
const ContentFile_1 = require("../../Paths/ContentFile");
const Settings_1 = require("../../Settings/Settings");
const help_1 = require("../commands/help");
const I18nUtils_1 = require("../../utils/I18nUtils");
const RED = "\x1b[31m";
const DEFAULT = "\x1b[0m";
const GREEN = "\x1b[32m";
const MAGENTA = "\x1b[35m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const WHITE = "\x1b[37m";
const ERR = {
    noArgs: "grep argument error. Usage: grep [OPTION]... PATTERN [FILE]... [-O] [OUTPUT FILE] [-m -B/A/C] [NUM]",
    noSearchArg: "grep argument error: At least one FILE argument must be passed, or pass -*/--search-all to search all files on server",
    badArgs: (args) => "grep argument error: Invalid argument(s): " + args.join(", "),
    badParameter: (option, arg) => `grep argument error: Incorrect ${option} argument "${arg}". Must be a number. OPTIONS with additional parameters (-O, -m, -B/A/C) must be separated from other options`,
    outFileExists: (path) => `grep file output failed: Invalid output file "${path}". Output file must not already exist. Pass -f/--allow-overwrite to overwrite.`,
    badOutFile: (path) => `grep file output failed: Invalid output file "${path}". Output file path must be a valid .txt file.`,
    truncated: () => `\n${YELLOW}Terminal output truncated to ${Settings_1.Settings.MaxTerminalCapacity} lines (Max terminal capacity)`,
};
const VALID_PARAMS = {
    preContext: { short: ["-B"], long: ["--before-context"] },
    context: { short: ["-C"], long: ["--context"] },
    postContext: { short: ["-A"], long: ["--after-context"] },
    maxMatches: { short: ["-m"], long: ["--max-count"] },
    outfile: { short: ["-O"], long: ["--output"] },
};
const VALID_ARGS = {
    isRegExpr: { short: ["-R"], long: ["--regexp"] },
    isLineNum: { short: ["-n"], long: ["--line-number"] },
    isNamed: { short: ["-H"], long: ["--with-filename"] },
    isNotNamed: { short: ["-h"], long: ["--no-filename"] },
    isInvertMatch: { short: ["-v"], long: ["--invert-match"] },
    isQuiet: { short: ["-q"], long: ["--silent", "--quiet"] },
    isVerbose: { short: ["-V"], long: ["--verbose"] },
    isOverWrite: { short: ["-f"], long: ["--allow-overwrite"] },
    isSearchAll: { short: ["-*"], long: ["--search-all"] },
    isPipeIn: { short: ["-p"], long: ["--pipe-terminal"] },
    isHelp: { short: [], long: ["--help"] },
    isMultiFile: { short: [], long: [] },
    hasContextFlag: { short: [], long: [] },
};
class Args {
    constructor(args) {
        this.INIT_OPTIONS = {
            isRegExpr: false,
            isLineNum: false,
            isNamed: false,
            isNotNamed: false,
            isInvertMatch: false,
            isQuiet: false,
            isVerbose: false,
            isOverWrite: false,
            isSearchAll: false,
            isPipeIn: false,
            isHelp: false,
            isMultiFile: false,
            hasContextFlag: false,
        };
        this.INIT_PARAMS = {
            preContext: "",
            context: "",
            postContext: "",
            maxMatches: "",
            outfile: "",
        };
        this.args = args.map(String);
        this.options = this.INIT_OPTIONS;
        this.params = this.INIT_PARAMS;
    }
    spliceParam(validArgs) {
        const argIndex = [...validArgs.long, ...validArgs.short].reduce((ret, arg) => {
            const argIndex = this.args.indexOf(arg);
            return argIndex > -1 ? argIndex : ret;
        }, NaN);
        if (isNaN(argIndex))
            return "";
        return this.args.splice(argIndex + 1, 1)[0];
    }
    spliceOptionalParams() {
        for (const [key, validArgs] of Object.entries(VALID_PARAMS)) {
            this.params[key] = this.spliceParam(validArgs);
        }
        return this;
    }
    reduceToOptionsAndFiles() {
        const stripDash = (arg) => arg.slice(1);
        const argKeys = Object.keys(VALID_ARGS).map((k) => k);
        const paramKeys = Object.keys(VALID_PARAMS).map((k) => k);
        const allValidArgs = [];
        let validFlagChars = "";
        for (const key of paramKeys) {
            const argString = VALID_PARAMS[key];
            allValidArgs.push(...argString.long, ...argString.short);
        }
        for (const key of argKeys) {
            const argString = VALID_ARGS[key];
            allValidArgs.push(...argString.long, ...argString.short);
            validFlagChars += argString.short.map(stripDash).join("");
        }
        const fileArgs = this.args.reduce((fileArgs, fullArg) => {
            if (!fullArg.startsWith("-"))
                return [...fileArgs, fullArg];
            const isLongArg = fullArg.startsWith("--");
            const isShortArg = fullArg.length === 2;
            let isBadArg = false;
            for (const key of argKeys) {
                const argStrings = VALID_ARGS[key];
                // check for exact matches
                if (isLongArg || isShortArg) {
                    isBadArg = !allValidArgs.includes(fullArg);
                    if (!isBadArg && [...argStrings.long, ...argStrings.short].includes(fullArg)) {
                        this.options[key] = true;
                    }
                }
                else {
                    // or check multiflag
                    const flagStr = stripDash(fullArg);
                    const shortArgs = argStrings.short.map(stripDash);
                    isBadArg = [...flagStr].some((char) => !validFlagChars.includes(char));
                    if (!isBadArg && shortArgs.some((arg) => [...flagStr].includes(arg))) {
                        this.options[key] = true;
                    }
                }
            }
            return !isBadArg ? fileArgs : [...fileArgs, fullArg];
        }, []);
        return fileArgs;
    }
    splitOptsAndArgs() {
        return [this.spliceOptionalParams().reduceToOptionsAndFiles(), this.options, this.params];
    }
}
class Results {
    constructor(results, options, params) {
        this.results = results;
        this.options = options;
        this.params = params;
        this.areEdited = results.some((line) => line.isMatched);
        this.numMatches = results.reduce((acc, result) => acc + Number(result.isMatched), 0);
    }
    addContext(context) {
        const nContext = isNaN(Number(context)) ? 0 : Number(context);
        for (const [editLineIndex, line] of this.results.entries()) {
            if (!line.isMatched)
                continue;
            for (let contextLineIndex = 0; contextLineIndex <= nContext; contextLineIndex++) {
                let contextLine;
                if (this.params.preContext) {
                    contextLine = this.results[editLineIndex - contextLineIndex];
                }
                else if (this.params.postContext) {
                    contextLine = this.results[editLineIndex + contextLineIndex];
                }
                else if (this.params.context) {
                    contextLine = this.results[editLineIndex - Math.floor(nContext / 2) + contextLineIndex];
                }
                else {
                    contextLine = line;
                }
                if (contextLine && !line.isFileSep && line.filename === contextLine.filename)
                    contextLine.isPrint = true;
            }
        }
        return this;
    }
    splitAndFilter() {
        const rawResult = [];
        const prettyResult = [];
        for (const lineInfo of this.results) {
            if (lineInfo.isPrint === this.options.isInvertMatch)
                continue;
            rawResult.push(lineInfo.lines.rawLine);
            prettyResult.push(lineInfo.lines.prettyLine);
        }
        return [rawResult, prettyResult];
    }
    capMatches(limit) {
        if (!this.params.maxMatches)
            return this;
        let matchCounter = 0;
        for (const line of this.results) {
            if (line.isMatched)
                matchCounter += 1;
            if (matchCounter > limit)
                line.isMatched = false;
        }
        return this;
    }
    getVerboseInfo(files, pattern, options) {
        if (!options.isVerbose)
            return "";
        const totalLines = this.results.length;
        const matchCount = Math.abs((options.isInvertMatch ? totalLines : 0) - this.numMatches);
        const inputStr = options.isPipeIn ? "piped from terminal " : `in ${(0, I18nUtils_1.pluralize)(files.length, "file")}:\n`;
        const filesStr = files
            .map((file, i) => `${i % 2 ? WHITE : ""}${file.filename}(${file.content.split("\n").length}loc)${DEFAULT}`)
            .join(", ");
        return [
            `\n${(this.params.maxMatches ? this.params.maxMatches : matchCount) + (options.isInvertMatch ? " INVERTED" : "")} `,
            (0, I18nUtils_1.pluralize)(matchCount, "line", undefined, true) + " matched ",
            `against PATTERN "${pattern.toString()}" `,
            `in ${(0, I18nUtils_1.pluralize)(totalLines, "line")}, `,
            inputStr,
            `${filesStr}`,
        ].join("");
    }
}
function getServerFiles(server) {
    const files = [];
    for (const tuple of (0, ContentFile_1.allContentFiles)(server)) {
        files.push(tuple[1]);
    }
    return [files, []];
}
function getArgFiles(args) {
    const notFiles = [];
    const files = [];
    for (const arg of args) {
        const file = (0, TextFilePath_1.hasTextExtension)(arg) ? Terminal_1.Terminal.getTextFile(arg) : Terminal_1.Terminal.getScript(arg);
        if (!file) {
            notFiles.push(arg);
        }
        else {
            files.push(file);
        }
    }
    return [files, notFiles];
}
function parseLine(pattern, options, filename, line, i) {
    const editedLine = line.replaceAll(pattern, `${RED}$&${DEFAULT}`);
    const name = options.isMultiFile || (options.isNamed && !options.isNotNamed) ? `${filename}` : "";
    const lineNo = options.isLineNum ? `${i + 1}` : "";
    const [colName, rawName] = name ? [`${MAGENTA}${name}${CYAN}:${DEFAULT}`, `${name}:`] : ["", ""];
    const [colLineNo, rawLineNo] = lineNo ? [`${GREEN}${lineNo}${CYAN}:${DEFAULT}`, `${lineNo}:`] : ["", ""];
    const lines = { rawLine: rawName + rawLineNo + line, prettyLine: colName + colLineNo + editedLine };
    const isMatched = line !== editedLine;
    return { lines, filename, isMatched, isPrint: false, isFileSep: false };
}
function parseFile(lineParser, options, file, i) {
    const parseLineFn = lineParser.bind(null, options, file.filename);
    const editedContent = file.content.split("\n").map(parseLineFn);
    const hasMatch = editedContent.some((line) => line.isMatched);
    const isPrintFileSep = options.hasContextFlag && hasMatch && i !== 0;
    const fileSeparator = {
        lines: { prettyLine: `${CYAN}--${DEFAULT}`, rawLine: "--" },
        isPrint: true,
        isMatched: false,
        isFileSep: true,
        filename: "",
    };
    return isPrintFileSep ? [fileSeparator, ...editedContent] : editedContent;
}
function writeToTerminal(prettyResult, options, results, files, pattern) {
    const printResult = prettyResult.slice(0, Math.min(prettyResult.length, Settings_1.Settings.MaxTerminalCapacity)); // limit printing to terminal
    const verboseInfo = results.getVerboseInfo(files, pattern, options);
    const truncateInfo = prettyResult.length !== printResult.length ? ERR.truncated() : "";
    if (results.areEdited)
        Terminal_1.Terminal.print(printResult.join("\n") + truncateInfo);
    if (options.isVerbose)
        Terminal_1.Terminal.print(verboseInfo);
}
function checkOutFile(outFileStr, options, server) {
    if (!outFileStr) {
        return null;
    }
    const outFilePath = Terminal_1.Terminal.getFilepath(outFileStr);
    if (!outFilePath || !(0, TextFilePath_1.hasTextExtension)(outFilePath)) {
        Terminal_1.Terminal.error(ERR.badOutFile(outFileStr));
        return null;
    }
    if (!options.isOverWrite && server.textFiles.has(outFilePath)) {
        Terminal_1.Terminal.error(ERR.outFileExists(outFileStr));
        return null;
    }
    return outFilePath;
}
function grabTerminal() {
    return Terminal_1.Terminal.outputHistory.map((line) => line.text ?? "");
}
function grep(args, server) {
    if (!args.length)
        return Terminal_1.Terminal.error(ERR.noArgs);
    const [otherArgs, options, params] = new Args(args).splitOptsAndArgs();
    if (options.isHelp)
        return (0, help_1.help)(["grep"]);
    options.hasContextFlag = !!params.context || !!params.preContext || !!params.postContext;
    const nContext = Math.max(Number(params.preContext), Number(params.context), Number(params.postContext));
    const nLimit = Number(params.maxMatches);
    if (options.hasContextFlag && (!nContext || isNaN(Number(params.context))))
        return Terminal_1.Terminal.error(ERR.badParameter("context", params.context));
    if (params.maxMatches && (!nLimit || isNaN(Number(params.maxMatches))))
        return Terminal_1.Terminal.error(ERR.badParameter("limit", params.maxMatches));
    const [files, notFiles] = options.isSearchAll ? getServerFiles(server) : getArgFiles(otherArgs.slice(1));
    if (notFiles.length)
        return Terminal_1.Terminal.error(ERR.badArgs(notFiles));
    if (!options.isPipeIn && !options.isSearchAll && !files.length)
        return Terminal_1.Terminal.error(ERR.noSearchArg);
    options.isMultiFile = files.length > 1;
    const outFilePath = checkOutFile(params.outfile, options, server);
    if (params.outfile && !outFilePath)
        return; // associated errors are printed in checkOutFile
    try {
        const pattern = options.isRegExpr ? new RegExp(otherArgs[0], "g") : otherArgs[0];
        const lineParser = parseLine.bind(null, pattern);
        const termParser = lineParser.bind(null, options, "Terminal");
        const fileParser = parseFile.bind(null, lineParser, options);
        const contentToMatch = options.isPipeIn ? grabTerminal().map(termParser) : files.flatMap(fileParser);
        const results = new Results(contentToMatch, options, params);
        const [rawResult, prettyResult] = results.capMatches(nLimit).addContext(nContext).splitAndFilter();
        if (options.isPipeIn)
            files.length = 0;
        if (!options.isQuiet)
            writeToTerminal(prettyResult, options, results, files, pattern);
        if (params.outfile && outFilePath)
            server.writeToContentFile(outFilePath, rawResult.join("\n"));
    }
    catch (error) {
        console.error(error);
        Terminal_1.Terminal.error(`grep processing error: ${error}`);
    }
}
