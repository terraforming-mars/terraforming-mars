import {IAward} from './IAward';
import {Player} from '../Player';
import {Resources} from '../Resources';

export class Botanist implements IAward {
    public name: string = 'Botanist';
    public description: string = 'Having the highest plant production'
    public getScore(player: Player): number {
      return player.getProduction(Resources.PLANTS);
    }
}
