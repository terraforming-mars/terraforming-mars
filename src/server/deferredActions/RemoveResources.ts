import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
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
    if (this.target.isProtected(this.resource)) {
      this.cb(0);
      return undefined;
    }

    const unprotectedQty = Math.min(this.target.stock.get(this.resource), this.count);
    const qtyLost = this.target.lossAfterProtection(this.resource, unprotectedQty);

    if (qtyLost === 0) {
      return undefined;
    }
    const msg = message('lose ${0} ${1}', (b) => b.number(qtyLost).string(this.resource));
    this.target.maybeBlockAttack(this.perpetrator, msg, (proceed) => {
      if (proceed) {
        this.target.stock.deduct(this.resource, qtyLost, {log: true, from: {player: this.perpetrator}});
        this.cb(qtyLost);
      }
      return undefined;
    });
    return undefined;
  }
}
