import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

export class Merchant extends BaseMilestone {
  private readonly CLAIM_COST = 8; // Claim cost in MegaCredits

  constructor() {
    super(
      'Merchant',
      'Having 2 of each standard resource after paying the claim cost.',
      12,
    );
  }

  public getScore(player: IPlayer): number {
    const adjustedMegaCredits = Math.max(0, player.stock[Resource.MEGACREDITS] - this.CLAIM_COST);

    const resources = [
      Resource.MEGACREDITS,
      Resource.STEEL,
      Resource.TITANIUM,
      Resource.PLANTS,
      Resource.ENERGY,
      Resource.HEAT,
    ];

    return resources.reduce((score, resource) => {
      const count = resource === Resource.MEGACREDITS ? adjustedMegaCredits : player.stock[resource];
      return score + Math.min(count, 2);
    }, 0);
  }
  // This is to take 'after payment' into the account, however testing this (for me) with all edge cases like Stormcraft/Helion may be hell
  public claim(player: IPlayer): void {
    new SelectPaymentDeferred(player, this.CLAIM_COST).execute();
  }
}
