import {Tag} from '../../common/cards/Tag';
import {IMilestone} from '../milestones/IMilestone';
import {Player} from '../Player';

export class OneGiantStep implements IMilestone {
  public readonly name = 'One Giant Step';
  // The original rules had "Have at least 4 moon tags in play" but that
  // was before the deck got 100% larger.
  public readonly description = 'Have at least 6 moon tags in play';
  public getScore(player: Player): number {
    return player.tags.count(Tag.MOON, 'milestone');
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 6;
  }
}
