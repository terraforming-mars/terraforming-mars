import {IAward} from './IAward';
import {Player} from '../Player';

export class Naturalist implements IAward {
  public name: string = 'Naturalist';
  public description: string = 'Most plant and heat production';

  public getScore(player: Player): number {
    return player.production.heat + player.production.plants;
  }
}
