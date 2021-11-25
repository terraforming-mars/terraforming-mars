import {IAward} from './IAward';
import {Player} from '../Player';
import {Tags} from '../cards/Tags';

export class Venuphile implements IAward {
    public name: string = 'Venuphile';
    public description: string = 'Having the most Venus tags in play'
    public getScore(player: Player): number {
      return player.getTagCount(Tags.VENUS, 'award');
    }
}
