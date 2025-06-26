import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {CardName} from '../../common/cards/CardName';
import {UnderworldExpansion} from '../underworld/UnderworldExpansion';
import {message} from '../logs/MessageBuilder';

export class RemoveResources extends DeferredAction<number> {
  constructor(
    private target: IPlayer,
    public perpetrator: IPlayer,
    public resource: Resource,
    public count: number = 1,
  ) {
    super(target, Priority.ATTACK_OPPONENT);
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
    const msg = message('lose ${0} ${1}', (b) => b.number(qtyLost).string(this.resource));
    // Move to this.target.maybeBlockAttack?
    this.target.defer(UnderworldExpansion.maybeBlockAttack(this.target, this.perpetrator, msg, (proceed) => {
      if (proceed) {
        this.target.stock.deduct(this.resource, qtyLost, {log: true, from: this.perpetrator});
        this.cb(qtyLost);
      }
      return undefined;
    }));
    return undefined;
  }
}
