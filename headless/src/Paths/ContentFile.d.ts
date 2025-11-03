import type { BaseServer } from "../Server/BaseServer";
import type { ScriptFilePath } from "./ScriptFilePath";
import type { TextFilePath } from "./TextFilePath";
import { FileMetadata } from "./FileMetadata";
/** Provide a common interface for accessing script and text files */
export type ContentFilePath = ScriptFilePath | TextFilePath;
export declare abstract class ContentFile {
    abstract filename: ContentFilePath;
    abstract get content(): string;
    abstract set content(value: string);
    metadata: FileMetadata;
    constructor();
    abstract deleteFromServer(server: BaseServer): boolean;
}
export type ContentFileMap = Map<ContentFilePath, ContentFile>;
/** Generator function to allow iterating through all content files on a server */
export declare function allContentFiles(server: BaseServer): Generator<[ContentFilePath, ContentFile], void, undefined>;
