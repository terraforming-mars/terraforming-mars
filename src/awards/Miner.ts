import {IAward} from './IAward';
import {Player} from '../Player';
import {Game} from '../Game';

export class Miner implements IAward {
    public name: string = 'Miner';
    public description: string = 'Having the most steel and titanium resource cubes'
    public getScore(player: Player, _game: Game): number {
      return player.steel + player.titanium;
    }
}
