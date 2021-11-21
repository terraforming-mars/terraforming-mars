import {IAward} from './IAward';
import {Player} from '../Player';
import {Tags} from '../cards/Tags';

export class Scientist implements IAward {
    public name: string = 'Scientist';
    public description: string = 'Having the most science tags in play'
    public getScore(player: Player): number {
      return player.getTagCount(Tags.SCIENCE, 'award');
    }
}
