import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';

export class Industrialist implements IAward {
  public readonly name = 'Industrialist';
  public readonly description = 'Have most steel and energy';
  public getScore(player: IPlayer): number {
    if (player.game.isDoneWithFinalProduction()) {
      return player.stock.steel + player.stock.energy;
    } else {
      return player.stock.steel + player.production.steel + player.production.energy;
    }
  }
}
