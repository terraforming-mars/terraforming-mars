import {Tags} from '../cards/Tags';
import {IMilestone} from '../milestones/IMilestone';
import {Player} from '../Player';

export class OneGiantStep implements IMilestone {
    public name: string = 'One Giant Step';
    // The original rules had "Have at least 4 moon tags in play" but that
    // was before the deck got 100% larger.
    public description: string = 'Have at least 6 moon tags in play'
    public getScore(player: Player): number {
      return player.getTagCount(Tags.MOON, 'milestone');
    }
    public canClaim(player: Player): boolean {
      return this.getScore(player) >= 6;
    }
}
