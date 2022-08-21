import {IAward} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class SpaceBaron implements IAward {
  public name: string = 'Space Baron';
  public description: string = 'Having the most space tags in play';
  public getScore(player: Player): number {
    return player.tags.count(Tag.SPACE, 'award');
  }
}
