import {IAward} from './IAward';
import {Player} from '../Player';

export class Industrialist implements IAward {
    public name: string = 'Industrialist';
    public description: string = 'Having most steel and energy resources'
    public getScore(player: Player): number {
      return player.steel + player.energy;
    }
}
