import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';

export class Cultivator implements IAward {
  public readonly name = 'Cultivator';
  public readonly description = 'Own the most greenery tiles';
  public getScore(player: IPlayer): number {
    return player.game.board.getGreeneries(player).length;
  }
}
