import {Player} from '../../Player';
import {isHazardTileType} from '../../../common/TileType';
import {IMilestone} from '../IMilestone';

export class Tropicalist implements IMilestone {
  public readonly name = 'Tropicalist';
  public readonly description = 'Have 3 tiles in the middle 3 equatorial rows';

  public getScore(player: Player): number {
    return player.game.board.spaces
      .filter((space) => space.player !== undefined &&
          space.player === player &&
          space.tile !== undefined &&
          isHazardTileType(space.tile.tileType) === false &&
          space.y >= 3 && space.y <= 5).length;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}
