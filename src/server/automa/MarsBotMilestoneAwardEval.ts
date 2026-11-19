import {IPlayer} from '@/server/IPlayer';
import {IAward} from '@/server/awards/IAward';
import {Resource} from '@/common/Resource';
import {BoardName} from '@/common/boards/BoardName';
import {marsBotMapSet} from '@/common/automa/marsBotMapSet';
import {IMarsBot} from '@/server/automa/IMarsBot';

/**
 * Whether MarsBot follows `boardName`'s own milestone and award rules.
 *
 * That holds on `boardName` unless the game plays the Milestones & Awards expansion, whose rules
 * are written against the Tharsis board whatever map the game is played on. Random milestones
 * and awards keep the map's rules.
 */
export function marsBotUsesBoardGoals(marsBot: IMarsBot, boardName: BoardName): boolean {
  return marsBotMapSet(marsBot.game.gameOptions) === boardName;
}

/**
 * The player's score in `award` as MarsBot compares it with its own.
 *
 * For Thermalist and Miner MarsBot considers the player's resources plus their production (rulebook A, p.8).
 */
export function humanAwardScore(award: IAward, player: IPlayer): number {
  switch (award.name) {
  case 'Thermalist':
    // Heat resources + energy resources (they become heat) + heat production. Energy
    // production doesn't count; designer ruling, BGG thread 3350125 (TDaver).
    return player.heat + player.energy + player.production.get(Resource.HEAT);
  case 'Miner':
    return player.steel + player.titanium + player.production.get(Resource.STEEL) + player.production.get(Resource.TITANIUM);
  default:
    return award.getScore(player);
  }
}
