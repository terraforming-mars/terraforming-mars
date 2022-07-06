import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Curator implements IAward {
  public name: string = 'Curator';
  public description: string = 'Having the most played tags of any one type';

  public getScore(player: Player): number {
    let max = 0;
    for (const tagString in Tags) {
      if (Object.prototype.hasOwnProperty.call(Tags, tagString)) {
        const tag: Tags = (<any>Tags)[tagString];
        if (tag === Tags.EVENT) continue;
        const count = player.getTagCount(tag, 'award');
        if (count > max) max = count;
      }
    }
    // if (player.cardIsInEffect(CardName.ASIMOV)) score += ASIMOV_AWARD_BONUS;

    return max;
  }
}
