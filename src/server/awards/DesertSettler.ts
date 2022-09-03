import {IAward} from './IAward';
import {Player} from '../Player';
import {isHazardTileType} from '../../common/TileType';
import {Board} from '../boards/Board';

export class DesertSettler implements IAward {
  public readonly name = 'Desert Settler';
  public readonly description = 'Most tiles south of the equator (the four bottom rows)';
  public getScore(player: Player): number {
    return player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter((space) =>
        space.tile !== undefined &&
          isHazardTileType(space.tile.tileType) === false &&
          space.y >= 5 && space.y <= 8).length;
  }
}
