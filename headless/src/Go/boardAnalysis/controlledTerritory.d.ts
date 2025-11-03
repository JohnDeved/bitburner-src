import type { Board, BoardState, PointState } from "../Types";
import { GoColor } from "@enums";
/**
 * Any empty space fully encircled by the opponent is not worth playing in, unless one of its borders explicitly has a weakness
 *
 * Specifically, ignore any empty space encircled by the opponent, unless one of the chains that is on the exterior:
 *   * does not have too many more liberties
 *   * has been fully encircled on the outside by the current player
 *   * Only has liberties remaining inside the abovementioned empty space
 *
 * In which case, only the liberties of that one weak chain are worth considering. Other parts of that fully-encircled
 * enemy space, and other similar spaces, should be ignored, otherwise the game drags on too long
 */
export declare function findDisputedTerritory(boardState: BoardState, player: GoColor, excludeFriendlyEyes?: boolean): PointState[];
/**
 If a group of stones has more than one empty holes that it completely surrounds, it cannot be captured, because white can
 only play one stone at a time.
 Thus, the empty space of those holes is firmly claimed by the player surrounding them, and it can be ignored as a play area
 Once all points are either stones or claimed territory in this way, the game is over

 Note that this does not detect mutual eyes formed by two chains making an eye together, or eyes via seki, or some other edge cases.
 */
export declare function findClaimedTerritory(board: Board): PointState[];
