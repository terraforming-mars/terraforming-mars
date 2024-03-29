import {IPlayer} from '../IPlayer';
import {SelectPayment} from '../inputs/basicInputs/SelectPayment';
import {Payment, PaymentOptions} from '../../common/inputs/Payment';
import {DeferredAction, Priority} from './DeferredAction';
import {Message} from '../../common/logs/Message';
import {message} from '../logs/MessageBuilder';

export class SelectPaymentDeferred extends DeferredAction<Payment> {
  constructor(
    player: IPlayer,
    public amount: number,
    public options: PaymentOptions,
    public title?: string | Message,
  ) {
    super(player, Priority.DEFAULT);
  }

  private pay(payment: Payment) {
    this.player.pay(payment);
    this.cb(payment);
  }

  public execute() {
    let retVal;
    const keys = Object.keys(this.player.GetPaymentOptions());
    switch (keys.length) {
      case 0:
        throw new Error('Player has no payment options')
      case 1:
        let payment: Payment = {[keys[0]]: this.amount}; 
        this.pay(payment)
        break;
      default:
        retVal = new SelectPayment(
          this.title || message('Select how to spend ${0} M€', (b) => b.number(this.amount)),
          this.amount,
          this.options
        ).andThen((payment) => {
          this.pay(payment)
          return undefined;
        });
    }
    return retVal;
  }
}
