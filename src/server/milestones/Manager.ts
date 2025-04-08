import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {isSpecialTileSpace, Board} from '../boards/Board';
import {MoonExpansion} from '../moon/MoonExpansion';

export class Manager extends BaseMilestone {
  constructor() {
    super(
      'Manager',
      'Have 3 special tiles in play',
      3);
  }
  public getScore(player: IPlayer): number {
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
    return marsCount + moonCount;
  }
}
