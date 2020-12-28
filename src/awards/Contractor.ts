import {IAward} from './IAward';
import {Player} from '../Player';
import {Game} from '../Game';
import {Tags} from '../cards/Tags';

export class Contractor implements IAward {
    public name: string = 'Contractor';
    public description: string = 'Most building tags (event cards do not count)'
    public getScore(player: Player, _game: Game): number {
      return player.getTagCount(Tags.BUILDING, false, false);
    }
}
