import {IMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {Units} from '@/common/Units';

const THREE_OF_EACH: Units = Units.every(3);

export class Merchant3 implements IMilestone {
  public readonly name = 'Merchant3';
  public readonly description = '3 of each standard resource (after paying the claim cost)';

  public getScore(player: IPlayer): number {
    if (this.canClaim(player)) {
      return 1;
    }
    return 0;
  }

  public canClaim(player: IPlayer): boolean {
    return player.canAfford({cost: player.milestoneCost(), reserveUnits: THREE_OF_EACH});
  }
}
