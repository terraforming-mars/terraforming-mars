import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
export class Mogul implements IAward {
  public readonly name = 'Mogul';
  public readonly description = 'Have the highest production (excluding M€) combined';

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium + player.production.plants + player.production.energy + player.production.heat;
  }
}
