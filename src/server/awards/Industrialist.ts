import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';

export class Industrialist implements IAward {
  public readonly name = 'Industrialist';
  public readonly description = 'Have most steel and energy';
  public readonly automaDescription = 'Energy track + 5';
  public getScore(player: IPlayer): number {
    if (player.game.isDoneWithFinalProduction()) {
      return player.steel + player.energy;
    } else {
      return player.steel + player.production.steel + player.production.energy;
    }
  }
}
