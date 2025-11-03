import type { JSONSchemaType } from "ajv";
import type { AllGangs } from "../../Gang/AllGangs";
/**
 * If we add/remove gangs, we must change 4 things:
 * - src\Gang\AllGangs.ts: getDefaultAllGangs
 * - src\Gang\data\Constants.ts: GangConstants.Names
 * - src\Gang\data\power.ts: PowerMultiplier
 * - Save file migration code.
 *
 * Gang code assumes that save data contains exactly gangs defined in these places.
 */
export declare const AllGangsSchema: JSONSchemaType<typeof AllGangs>;
