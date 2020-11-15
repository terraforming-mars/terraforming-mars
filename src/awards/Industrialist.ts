import {IAward} from './IAward';
import {Player} from '../Player';
import {Game} from '../Game';

export class Industrialist implements IAward {
    public name: string = 'Industrialist';
    public description: string = 'Having most steel and energy resources'
    public getScore(player: Player, _game: Game): number {
      return player.steel + player.energy;
    }
}
