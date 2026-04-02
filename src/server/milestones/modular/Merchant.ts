import {IMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Units} from '../../../common/Units';

const TWO_OF_EACH: Units = Units.every(2);

export class Merchant implements IMilestone {
  public readonly name = 'Merchant';
  public readonly description = '2 of each standard resource (after paying the claim cost)';

  public getScore(player: IPlayer): number {
    if (this.canClaim(player)) {
      return 1;
    }
    return 0;
  }

  public canClaim(player: IPlayer): boolean {
    return player.canAfford({cost: player.milestoneCost(), reserveUnits: TWO_OF_EACH});
  }
}
