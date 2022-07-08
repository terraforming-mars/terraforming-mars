import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Biologist implements IAward {
  public name: string = 'Biologist';
  public description: string = 'Having the most Animal, Plant, and Microbe tags in play';

  public getScore(player: Player): number {
    return player.getTagCount(Tags.MICROBE, 'award') + player.getTagCount(Tags.PLANT, 'award') + player.getTagCount(Tags.ANIMAL, 'award');
  }
}
