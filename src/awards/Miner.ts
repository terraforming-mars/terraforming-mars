import {IAward} from './IAward';
import {Player} from '../Player';

export class Miner implements IAward {
    public name: string = 'Miner';
    public description: string = 'Having the most steel and titanium resource cubes'
    public getScore(player: Player): number {
      return player.steel + player.titanium;
    }
}
