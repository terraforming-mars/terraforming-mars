import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';

export class Edgedancer implements IAward {
  public readonly name = 'Edgedancer';
  public readonly description = 'Own the most tiles on the edges of the board';

  public getScore(player: IPlayer): number {
    return player.game.board.getEdges()
      .filter(Board.hasRealTile)
      .filter(Board.ownedBy(player)).length;
  }
}
