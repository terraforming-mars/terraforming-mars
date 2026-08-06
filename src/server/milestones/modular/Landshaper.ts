import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {isSpecialTileSpace, Board} from '../../boards/Board';
import {Tag} from '../../../common/cards/Tag';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../../automa/MarsBotMilestoneAwardEval';

export class Landshaper extends BaseMilestone {
  constructor() {
    super(
      'Landshaper',
      'Have 1 city tile, 1 greenery and 1 special tile',
      3);
  }
  public getScore(player: IPlayer): number {
    let score = 0;

    // Duplicated in SpaceRaceToMars
    const marsSpaces = player.game.board.spaces;
    const marsCount = marsSpaces.filter(Board.ownedBy(player))
      .filter(isSpecialTileSpace).length;

    const moonSpaces = player.game.moonData?.moon.spaces ?? [];
    const moonCount = moonSpaces
      .filter(Board.ownedBy(player))
      .filter(isSpecialTileSpace)
      .length;
    if ((marsCount + moonCount) > 0) {
      score+=1;
    }

    if (player.game.board.getCities(player).length > 0) {
      score+=1;
    }
    if (player.game.board.getGreeneries(player).length > 0) {
      score+=1;
    }

    return score;
  }

  /** MarsBot shapes land with a city, a greenery and space 5 on its building track. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return bot.game.board.getCities(bot.player).length >= 1 &&
      bot.game.board.getGreeneries(bot.player).length >= 1 &&
      marsBotTrackPosition(bot, Tag.BUILDING) >= 5;
  }
}
