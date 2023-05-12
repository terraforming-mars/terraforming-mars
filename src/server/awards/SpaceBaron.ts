import {IAward} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class SpaceBaron implements IAward {
  public readonly name = 'Space Baron';
  public readonly description = 'Have the most space tags';
  public getScore(player: Player): number {
    return player.tags.count(Tag.SPACE, 'award');
  }
}
