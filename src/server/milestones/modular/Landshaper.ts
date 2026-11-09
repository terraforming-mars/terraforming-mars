import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {isSpecialTileSpace, Board} from '../../boards/Board';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Landshaper extends BaseMilestone {
  public readonly automaDescription = '1+ city, 1+ greenery, Building track ≥ 5';
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

  /** MarsBot needs a city, a greenery and space 5 of its Building track (rulebook C p.13). */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.game.board.getCities(marsBot.player).length >= 1 &&
      marsBot.game.board.getGreeneries(marsBot.player).length >= 1 &&
      marsBot.marsBotBoard.trackPosition(Tag.BUILDING) >= 5;
  }
}
