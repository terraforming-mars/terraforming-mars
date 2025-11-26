import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {isSpecialTileSpace, Board} from '@/server/boards/Board';

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
      // TODO(kberg): include co-owner.
      .filter(Board.ownedBy(player))
      .filter(isSpecialTileSpace)
      .length;
    if ((marsCount + moonCount) > 0) score+=1;

    if (player.game.board.getCities(player).length > 0) score+=1;
    if (player.game.board.getGreeneries(player).length > 0) score+=1;

    return score;
  }
}
