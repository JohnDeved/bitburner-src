import type { BaseServer } from "./Server/BaseServer";
import { type IReviverValue } from "./utils/JSONReviver";
import type { TextFilePath } from "./Paths/TextFilePath";
import { ContentFile } from "./Paths/ContentFile";
/** Represents a plain text file that is typically stored on a server. */
export declare class TextFile extends ContentFile {
    /** The full file name. */
    filename: TextFilePath;
    /** The content of the file. */
    text: string;
    get content(): string;
    set content(text: string);
    constructor(filename?: TextFilePath, txt?: string);
    /** Serialize the current file to a JSON save state. */
    toJSON(): IReviverValue;
    deleteFromServer(server: BaseServer): boolean;
    /** Initializes a TextFile from a JSON save state. */
    static fromJSON(value: IReviverValue): TextFile;
}
