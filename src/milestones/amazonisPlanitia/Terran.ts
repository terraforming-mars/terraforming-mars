import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {IMilestone} from '../IMilestone';

export class Terran implements IMilestone {
  public name: string = 'Terran';
  public description: string = 'Have 6 Earth tags';

  public getScore(player: Player): number {
    return player.getTagCount(Tags.EARTH);
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 6;
  }
}
