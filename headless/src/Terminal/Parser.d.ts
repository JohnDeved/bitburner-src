/** split a commands string into a commands array */
export declare function splitCommands(commandsText: string): string[];
/** parse a commands string, including alias substitution, into a commands array */
export declare function parseCommands(commandsText: string): string[];
/** get a commandArgs array from a single command string */
export declare function parseCommand(command: string): (string | number | boolean)[];
