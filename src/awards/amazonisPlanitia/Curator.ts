import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Curator implements IAward {
  public name: string = 'Curator';
  public description: string = 'Most played tags of any one type';

  public getScore(player: Player): number {
    const scores = [];
    for (const tag in Tags) {
      if (Object.prototype.hasOwnProperty.call(Tags, tag)) {
        if (tag !== Tags.EVENT) scores.push(player.getTagCount(tag as Tags, 'award'));
      }
    }

    const score = Math.max(...scores);

    // if (player.cardIsInEffect(CardName.ASIMOV)) score += ASIMOV_AWARD_BONUS;

    return score;
  }
}
