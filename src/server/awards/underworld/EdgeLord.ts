import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';

export class EdgeLord implements IAward {
  public readonly name = 'EdgeLord';
  public readonly description = 'Have the highest number of excavation markers on the edges of the board.';
  public getScore(player: IPlayer): number {
    return player.game.board.getEdges().filter((space) => space.excavator === player).length;
  }
}
