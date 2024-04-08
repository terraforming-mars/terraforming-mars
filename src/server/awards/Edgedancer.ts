import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {isHazardTileType} from '../../common/AresTileType';

export class Edgedancer implements IAward {
  public readonly name = 'Edgedancer';
  public readonly description = 'Own the most tiles on the edges of the board';

  public getScore(player: IPlayer): number {
    return player.game.board.getEdges()
      .filter((space) => space.player !== undefined &&
        space.player === player &&
        space.tile !== undefined &&
        isHazardTileType(space.tile.tileType) === false).length;
  }
}
