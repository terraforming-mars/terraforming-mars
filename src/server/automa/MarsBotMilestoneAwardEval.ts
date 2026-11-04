import {BoardName} from '@/common/boards/BoardName';
import {marsBotMapSet} from '@/common/automa/marsBotMapSet';
import {IMarsBot} from '@/server/automa/IMarsBot';

/** Every track position, the Venus track included when in play. */
export function marsBotAllTrackPositions(bot: IMarsBot): Array<number> {
  return bot.marsBotBoard.tracks.map((track) => track.position);
}

/**
 * Whether MarsBot follows `boardName`'s own milestone and award rules.
 *
 * That holds on `boardName` unless the game plays the Milestones & Awards expansion, whose rules
 * are written against the Tharsis board whatever map the game is played on. Random milestones
 * and awards keep the map's rules.
 */
export function marsBotUsesMapSet(bot: IMarsBot, boardName: BoardName): boolean {
  return marsBotMapSet(bot.game.gameOptions) === boardName;
}
