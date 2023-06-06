import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';

export class Entrepreneur implements IAward {
  public readonly name = 'Entrepreneur';
  public readonly description = 'Own the most tiles that grant adjacency bonuses';
  public getScore(player: IPlayer): number {
    return player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter((space) => (space.adjacency && space.adjacency.bonus.length > 0)).length;
  }
}
