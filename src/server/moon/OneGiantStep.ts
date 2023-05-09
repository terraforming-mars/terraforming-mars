import {Tag} from '../../common/cards/Tag';
import {BaseMilestone} from '../milestones/IMilestone';
import {Player} from '../Player';

export class OneGiantStep extends BaseMilestone {
  constructor() {
    super(
      'One Giant Step',
      // The original rules had "Have at least 4 moon tags in play" but that
      // was before the deck got 100% larger.
      'Have 6 moon tags',
      6);
  }

  public getScore(player: Player): number {
    return player.tags.count(Tag.MOON, 'milestone');
  }
}
