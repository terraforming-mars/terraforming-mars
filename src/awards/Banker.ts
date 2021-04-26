import {IAward} from './IAward';
import {Player} from '../Player';
import {Resources} from '../Resources';

export class Banker implements IAward {
    public name: string = 'Banker';
    public description: string = 'Having the highest M€ production'
    public getScore(player: Player): number {
      return player.getProduction(Resources.MEGACREDITS);
    }
}
