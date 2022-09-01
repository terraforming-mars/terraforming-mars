import {MoonExpansion} from '../../moon/MoonExpansion';
import {Player} from '../../Player';
import {isHazardTileType, TileType} from '../../../common/TileType';
import {IMilestone} from '../IMilestone';

export class TerraPioneer implements IMilestone {
  public readonly name = 'Terra Pioneer';
  public readonly description = 'Have 5 tiles on Mars';

  public getScore(player: Player): number {
    // Don't simplify this to "space.tile?.tileType !== TileType.OCEAN"
    // Because that will make Land Claim a valid space for Landlord
    const marsSpaces = player.game.board.spaces.filter(
      (space) => space.tile !== undefined && isHazardTileType(space.tile.tileType) === false && space.tile.tileType !== TileType.OCEAN && space.player === player,
    ).length;

    const moonSpaces = MoonExpansion.ifElseMoon(player.game, (moonData) => moonData.moon.spaces.filter(
      (space) => space.tile !== undefined && space.player === player).length,
    () => 0);

    return marsSpaces + moonSpaces;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 5;
  }
}
