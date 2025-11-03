import { type IReviverValue } from "../utils/JSONReviver";
export declare class FileMetadata {
    /** Time of Access */
    atime: number;
    /** Time of Modification */
    mtime: number;
    /** Time of Birth (creation) */
    btime: number;
    /** Create a FileMetadata with everything set to the current time */
    constructor();
    /** Change metadata to reflect a read just happened */
    read(): void;
    /** Change metadata to reflect a write just happened */
    edit(): void;
    /** Get a plain version of this object */
    plain(): {
        atime: number;
        mtime: number;
        btime: number;
    };
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): FileMetadata;
}
