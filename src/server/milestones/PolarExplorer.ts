import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {isHazardTileType} from '../../common/TileType';
import {Board} from '../boards/Board';

export class PolarExplorer implements IMilestone {
  public readonly name = 'Polar Explorer';
  public readonly description = 'Requires that you have 3 tiles on the two bottom rows';
  public getScore(player: Player): number {
    return player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter((space) => space.tile !== undefined &&
        isHazardTileType(space.tile.tileType) === false &&
        space.y >= 7 && space.y <= 8).length;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}

