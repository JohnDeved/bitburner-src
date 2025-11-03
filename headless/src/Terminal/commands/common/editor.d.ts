import { ScriptEditorRouteOptions } from "../../../ui/Router";
import { BaseServer } from "../../../Server/BaseServer";
interface EditorParameters {
    args: (string | number | boolean)[];
    server: BaseServer;
}
export declare function commonEditor(command: string, { args, server }: EditorParameters, options?: ScriptEditorRouteOptions): void;
export {};
