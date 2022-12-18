import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {IAward, getAdditionalScore} from '../IAward';

export class Curator implements IAward {
  public readonly name = 'Curator';
  public readonly description = 'Having the most played tags of any one type';

  public getScore(player: Player): number {
    let score = 0;
    for (const tagString in Tag) {
      if (Object.prototype.hasOwnProperty.call(Tag, tagString)) {
        const tag: Tag = (<any>Tag)[tagString];
        if (tag === Tag.EVENT) continue;
        const count = player.tags.count(tag, 'award');
        if (count > score) score = count;
      }
    }
    return score + getAdditionalScore(player);
  }
}
