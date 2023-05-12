import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Curator implements IAward {
  public readonly name = 'Curator';
  public readonly description = 'Have the most tags of any one type';

  public getScore(player: Player): number {
    let max = 0;
    for (const tagString in Tag) {
      if (Object.prototype.hasOwnProperty.call(Tag, tagString)) {
        const tag: Tag = (<any>Tag)[tagString];
        if (tag === Tag.EVENT) continue;
        const count = player.tags.count(tag, 'award');
        if (count > max) max = count;
      }
    }

    return max;
  }
}
