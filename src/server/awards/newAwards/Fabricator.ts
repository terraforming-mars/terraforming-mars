import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
export class Fabricator implements IAward {
  public readonly name = 'Fabricator';
  public readonly description = 'Have the highest production of steel and heat combined.';

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.heat;
  }
}
