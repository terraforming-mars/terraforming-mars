import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';

export class DesertSettler implements IAward {
  public readonly name = 'Desert Settler';
  public readonly description = 'Own the most tiles south of the equator (the rows below the middle row)';
  public getScore(player: IPlayer): number {
    const board = player.game.board;
    return board.spaces
      .filter(Board.ownedBy(player))
      .filter(Board.hasRealTile)
      .filter((space) => space.y > board.equatorRow)
      .length;
  }
}
