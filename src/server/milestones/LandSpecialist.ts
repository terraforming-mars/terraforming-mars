import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {isSpecialTile, playerTileFn} from '../boards/Board';
import {MoonExpansion} from '../moon/MoonExpansion';

export class LandSpecialist implements IMilestone {
  public readonly name = 'Land Specialist';
  public readonly description = 'Requires that you have 3 special (normally, brown) tiles in play';
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
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}
