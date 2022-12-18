import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class SpaceBaron implements IAward {
  public readonly name = 'Space Baron';
  public readonly description = 'Having the most space tags in play';
  public getScore(player: Player): number {
    const score = player.tags.count(Tag.SPACE, 'award');
    return score + getAdditionalScore(player);
  }
}
