import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';

export class Miner implements IAward {
  public readonly name = 'Miner';
  public readonly description = 'Have the most steel and titanium';
  public getScore(player: IPlayer): number {
    if (player.game.isDoneWithFinalProduction()) {
      return player.stock.steel + player.stock.titanium;
    } else {
      return player.stock.steel + player.production.steel + player.stock.titanium + player.production.titanium;
    }
  }
}
