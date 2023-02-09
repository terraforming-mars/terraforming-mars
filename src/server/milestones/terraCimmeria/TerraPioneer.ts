import {Player} from '../../Player';
import {isHazardTileType, TileType} from '../../../common/TileType';
import {SpaceType} from '../../../common/boards/SpaceType';
import {IMilestone} from '../IMilestone';

export class TerraPioneer implements IMilestone {
  public readonly name = 'Terra Pioneer';
  public readonly description = 'Have 5 tiles on Mars';

  public getScore(player: Player): number {
    // Don't simplify this to "space.tile?.tileType !== TileType.OCEAN"
    // Because that will make Land Claim a valid space for Landlord
    const marsSpaces = player.game.board.spaces.filter(
      (space) => {
        return space.tile !== undefined &&
          isHazardTileType(space.tile.tileType) === false &&
          space.tile.tileType !== TileType.OCEAN &&
          space.spaceType !== SpaceType.COLONY &&
          space.player === player;
      },
    ).length;

    return marsSpaces;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 5;
  }
}
