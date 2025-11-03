/** Function for getting a list of keys to use for saving an object
 * @param ctor the class constructor
 *
 * @param removedKeys Keys that exist on a default constructed member, but should not be saved.
 *                    These keys will just revert to default values on load.
 *
 * @param addedKeys   Optional keys that do not exist on a default constructed member, but should be saved when present.
 */
export declare function getKeyList<T extends object>(ctor: new () => T, modifications?: {
    removedKeys?: readonly (keyof T)[];
    addedKeys?: readonly (keyof T)[];
}): readonly (keyof T)[];
