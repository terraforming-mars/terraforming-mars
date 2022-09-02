import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {IMilestone} from '../IMilestone';

export class Terran implements IMilestone {
  public readonly name = 'Terran';
  public readonly description = 'Have 6 Earth tags';

  public getScore(player: Player): number {
    return player.tags.count(Tag.EARTH);
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 6;
  }
}
