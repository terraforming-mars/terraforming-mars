import {IMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Units} from '../../../common/Units';

export class Merchant implements IMilestone {
  public static readonly TWO_OF_EACH: Units = {
    megacredits: 2,
    steel: 2,
    titanium: 2,
    plants: 2,
    energy: 2,
    heat: 2,
  } as const;

  public readonly name = 'Merchant';
  public readonly description = '2 of each standard resource (after paying the claim cost)';

  public getScore(player: IPlayer): number {
    if (this.canClaim(player)) {
      return 1;
    }
    return 0;
  }


  public canClaim(player: IPlayer): boolean {
    return player.canAfford({cost: player.milestoneCost(), reserveUnits: Merchant.TWO_OF_EACH});
  }
}
