import {IAward} from './IAward';
import {Player} from '../Player';
import {Tags} from '../common/cards/Tags';

export class Voyager implements IAward {
  public name: string = 'Voyager';
  public description: string = 'Most Jovian tags in play';

  public getScore(player: Player): number {
    return player.getTagCount(Tags.JOVIAN, 'award');
  }
}
