import {IAward} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Venuphile implements IAward {
  public name: string = 'Venuphile';
  public description: string = 'Having the most Venus tags in play';
  public getScore(player: Player): number {
    return player.tags.count(Tag.VENUS, 'award');
  }
}
