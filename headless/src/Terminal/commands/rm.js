"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rm = rm;
const Terminal_1 = require("../../Terminal");
const PromptManager_1 = require("../../ui/React/PromptManager");
const Directory_1 = require("../../Paths/Directory");
function rm(args, server) {
    const errors = {
        arg: (reason) => `Incorrect usage of rm command. ${reason}. Usage: rm [OPTION]... [FILE]...`,
        dirsProvided: (name) => `Incorrect usage of rm command. To delete directories, use the -r flag. Failing directory: ${name}`,
        invalidFile: (name) => `Invalid filename: ${name}`,
        noSuchFile: (name) => `File does not exist: ${name}`,
        noSuchDir: (name) => `Directory does not exist: ${name}`,
        deleteFailed: (name, reason) => `Failed to delete "${name}". ${reason ?? "Uncaught error"}`,
        rootDeletion: () => "You are trying to delete all files within the root directory. If this is intentional, use the --no-preserve-root flag",
    };
    if (args.length === 0)
        return Terminal_1.Terminal.error(errors["arg"]("No arguments provided"));
    const recursive = args.includes("-r") || args.includes("-R") || args.includes("--recursive") || args.includes("-rf");
    const force = args.includes("-f") || args.includes("--force") || args.includes("-rf");
    const ignoreSpecialRoot = args.includes("--no-preserve-root");
    const isTargetString = (arg, index, array) => typeof arg === "string" && (!arg.startsWith("-") || (index - 1 >= 0 && array[index - 1] === "--"));
    const targets = args.filter(isTargetString);
    if (targets.length === 0)
        return Terminal_1.Terminal.error(errors["arg"]("No targets provided"));
    if (!ignoreSpecialRoot && targets.includes("/"))
        return Terminal_1.Terminal.error(errors["rootDeletion"]());
    const directories = [];
    const files = [];
    const allDirs = (0, Directory_1.getAllDirectories)(server);
    const allFiles = new Set([
        ...server.scripts.keys(),
        ...server.textFiles.keys(),
        ...server.programs,
    ]);
    for (const file of server.contracts) {
        allFiles.add(file.fn);
    }
    for (const file of server.messages) {
        if (file.endsWith(".lit")) {
            allFiles.add(file);
        }
    }
    for (const target of targets) {
        // Directories can be specified with or without a trailing slash. However,
        // trying to remove a file with a trailing slash is an error.
        const fileDir = Terminal_1.Terminal.getDirectory(target + (target[target.length - 1] === "/" ? "" : "/"));
        const file = Terminal_1.Terminal.getFilepath(target);
        const fileExists = file !== null && allFiles.has(file);
        if (fileDir === null)
            return Terminal_1.Terminal.error(errors.invalidFile(target));
        const dirExists = allDirs.has(fileDir);
        if (file === null || dirExists) {
            // If file === null, it means we specified a trailing-slash directory/,
            // or something that does not have an extension or otherwise isn't file-like.
            if (fileExists) {
                // We have this early case here specifically to handle situations where
                // a file and a directory with the same name exist. That's right, you
                // can have *both* /foo.txt *and* /foo.txt/bar.txt.
                //
                // In this case, we need to treat filenames preferrentially as files first.
                // If we have -r, we will *also* delete the directory.
                files.push(file);
            }
            if (!recursive) {
                if (fileExists) {
                    // This is valid, but we shouldn't touch the directory.
                    continue;
                }
                else {
                    // Only exists as a directory (maybe).
                    return Terminal_1.Terminal.error(errors.dirsProvided(target));
                }
            }
            if (!dirExists && !force) {
                return Terminal_1.Terminal.error(errors.noSuchDir(target));
            }
            // If we pass -f and pass a non-existing directory, we will add it
            // here and then it will match no files, producing no errors. This
            // aligns with Unix rm.
            directories.push(fileDir);
            continue;
        }
        if (!force && !allFiles.has(file)) {
            // With -f, we ignore file-not-found and try to delete everything at the end.
            return Terminal_1.Terminal.error(errors.noSuchFile(target));
        }
        files.push(file);
    }
    for (const file of allFiles) {
        for (const dir of directories) {
            if (file.startsWith(dir)) {
                files.push(file);
            }
        }
    }
    const targetList = files.map((file) => "* " + file.toString()).join("\n");
    const reports = [];
    const deleteSelectedTargets = () => {
        for (const file of files) {
            reports.push({ target: file, result: server.removeFile(file) });
        }
        for (const report of reports) {
            if (report.result.res) {
                Terminal_1.Terminal.success(`Deleted: ${report.target}`);
            }
            else {
                Terminal_1.Terminal.error(errors.deleteFailed(report.target, report.result.msg));
            }
        }
    };
    if (force ||
        (files.length === 1 && !files[0].endsWith(".exe") && !files[0].endsWith(".lit") && !files[0].endsWith(".cct"))) {
        deleteSelectedTargets();
    }
    else {
        const promptText = `Are you sure you want to delete ${files.length === 1 ? files[0] : "these files"}? This is irreversible.${files.length > 1 ? "\n\nDeleting:\n" + targetList : ""}`;
        PromptManager_1.PromptEvent.emit({
            txt: promptText,
            resolve: (value) => {
                if (typeof value === "string")
                    throw new Error("PromptEvent got a string, expected boolean");
                if (value)
                    deleteSelectedTargets();
            },
        });
    }
}
