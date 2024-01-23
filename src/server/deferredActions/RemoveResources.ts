import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {DeferredAction, Priority} from './DeferredAction';
import {CardName} from '../../common/cards/CardName';
import {UnderworldExpansion} from '../underworld/UnderworldExpansion';

export class RemoveResources extends DeferredAction<number> {
  constructor(
    player: IPlayer,
    public target: IPlayer,
    public resource: Resource,
    public count: number = 1,
  ) {
    super(player, Priority.ATTACK_OPPONENT);
  }

  public execute() {
    if (this.resource === Resource.PLANTS) {
      if (this.target.plantsAreProtected()) {
        this.cb(0);
        return undefined;
      }
    }
    if (this.resource === Resource.STEEL || this.resource === Resource.TITANIUM) {
      if (this.target.alloysAreProtected()) {
        this.cb(0);
        return undefined;
      }
    }

    let qtyLost = Math.min(this.target.stock.get(this.resource), this.count);

    // Botanical Experience hook.
    if (this.resource === Resource.PLANTS && this.target.cardIsInEffect(CardName.BOTANICAL_EXPERIENCE)) {
      qtyLost = Math.ceil(qtyLost / 2);
    }

    if (qtyLost === 0) {
      return undefined;
    }
    // Move to this.target.maybeBlockAttack?
    return UnderworldExpansion.maybeBlockAttack(this.target, this.player, () => {
      this.target.stock.deduct(this.resource, qtyLost, {log: true, from: this.player});
      this.cb(qtyLost);
      return undefined;
    });
  }
}
