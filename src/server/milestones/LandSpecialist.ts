import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {isSpecialTileSpace, playerTileFn} from '../boards/Board';
import {MoonExpansion} from '../moon/MoonExpansion';

export class LandSpecialist extends BaseMilestone {
  constructor() {
    super(
      'Land Specialist',
      'Own 3 special (normally, brown) tiles',
      3);
  }
  public getScore(player: IPlayer): number {
    const spaces = player.game.board.spaces
      .filter(playerTileFn(player))
      .filter(isSpecialTileSpace);

    const marsCount = spaces.length;
    // Repeated in SpaceRaceToMars
    const moonCount = MoonExpansion.ifElseMoon(player.game, (moonData) => {
      return moonData.moon.spaces
        .filter(playerTileFn(player))
        .filter(isSpecialTileSpace)
        .length;
    },
    () => 0);
    return marsCount + moonCount;
  }
}
