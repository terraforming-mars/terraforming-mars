import {BoardName} from '@/common/boards/BoardName';
import {marsBotMapSet} from '@/common/automa/marsBotMapSet';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';

/**
 * Whether the game plays `boardName`'s own milestone and award set. Then the rulebook's map
 * rules apply. With random or modular milestones and awards MarsBot follows the modular
 * rules, which are written against the Tharsis board whatever map the game is played on.
 */
export function marsBotUsesMapSet(bot: IMarsBot, boardName: BoardName): boolean {
  return marsBotMapSet(bot.game.gameOptions) === boardName;
}
