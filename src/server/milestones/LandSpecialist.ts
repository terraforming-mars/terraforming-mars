import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {isSpecialTile, playerTileFn} from '../boards/Board';
import {MoonExpansion} from '../moon/MoonExpansion';

export class LandSpecialist extends BaseMilestone {
  constructor() {
    super(
      'Land Specialist',
      'Have 3 special (normally, brown) tiles',
      3);
  }
  public getScore(player: Player): number {
    const spaces = player.game.board.spaces
      .filter(playerTileFn(player))
      .filter(isSpecialTile);

    const marsCount = spaces.length;
    // Repeated in SpaceRaceToMars
    const moonCount = MoonExpansion.ifElseMoon(player.game, (moonData) => {
      return moonData.moon.spaces
        .filter(playerTileFn(player))
        .filter(isSpecialTile)
        .length;
    },
    () => 0);
    return marsCount + moonCount;
  }
}
