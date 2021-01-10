import {IAward} from './IAward';
import {Player} from '../Player';

export class Thermalist implements IAward {
    public name: string = 'Thermalist';
    public description: string = 'Having the most heat resource cubes'
    public getScore(player: Player): number {
      return player.heat;
    }
}
