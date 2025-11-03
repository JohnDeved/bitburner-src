import { BaseServer } from "../Server/BaseServer";
import { ContentFileMap } from "./ContentFile";
/** Search for files (Script and TextFile only) that match a given glob pattern
 * @param pattern The glob pattern. Supported glob characters are * and ?
 * @param server The server to search using the pattern
 * @param currentDir The base directory. Optional, defaults to root. Also forced to root if the pattern starts with /
 * @returns A map keyed by paths (ScriptFilePath or TextFilePath) with files as values (Script or TextFile). */
export declare function getGlobbedFileMap(pattern: string, server: BaseServer, currentDir?: import("./Directory").Directory): ContentFileMap;
