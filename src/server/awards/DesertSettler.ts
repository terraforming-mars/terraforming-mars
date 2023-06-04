import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {isHazardTileType} from '../../common/TileType';
import {Board} from '../boards/Board';

export class DesertSettler implements IAward {
  public readonly name = 'Desert Settler';
  public readonly description = 'Own the most tiles south of the equator (the four bottom rows)';
  public getScore(player: IPlayer): number {
    return player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter((space) =>
        space.tile !== undefined &&
          isHazardTileType(space.tile.tileType) === false &&
          space.y >= 5 && space.y <= 8).length;
  }
}
