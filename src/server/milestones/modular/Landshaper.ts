import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {isSpecialTileSpace, Board} from '../../boards/Board';
import {MoonExpansion} from '../../moon/MoonExpansion';

export class Landshaper extends BaseMilestone {
  constructor() {
    super(
      'Landshaper',
      'Have 1 city tile, 1 greenery and 1 special tile',
      3);
  }
  public getScore(player: IPlayer): number {
    let score = 0;
    const spaces = player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter(isSpecialTileSpace);

    const marsCount = spaces.length;
    // Repeated in SpaceRaceToMars
    const moonCount = MoonExpansion.ifElseMoon(player.game, (moonData) => {
      return moonData.moon.spaces
        .filter(Board.ownedBy(player))
        .filter(isSpecialTileSpace)
        .length;
    },
    () => 0);

    if ((marsCount + moonCount) > 0) score+=1;
    if (player.game.board.getCities(player).length > 0) score+=1;
    if (player.game.board.getGreeneries(player).length > 0) score+=1;

    return score;
  }
}
