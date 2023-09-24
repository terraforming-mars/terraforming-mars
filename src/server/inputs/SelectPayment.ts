import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {isPayment, Payment, PaymentOptions} from '../../common/inputs/Payment';
import {InputResponse, isSelectPaymentResponse} from '../../common/inputs/InputResponse';
import {IPlayer} from '../IPlayer';

export class SelectPayment extends BasePlayerInput {
  constructor(
    title: string | Message,
    public amount: number,
    public paymentOptions: Partial<PaymentOptions>,
    public cb: (payment: Payment) => PlayerInput | undefined,
  ) {
    super('payment', title);
    this.buttonLabel = 'Pay'; // no input button
  }

  public process(input: InputResponse, player: IPlayer) {
    if (!isSelectPaymentResponse(input)) {
      throw new Error('Not a valid SelectPaymentResponse');
    }
    const payment = input.payment;
    if (!isPayment(payment)) {
      throw new Error('payment is not a valid type');
    }
    // TODO(kberg): This is called here and in SelectPaymentDeferred.
    // There's no reason for both.
    if (!player.canSpend(payment)) {
      throw new Error('You do not have that many resources');
    }
    if (!player.canSpend(payment)) {
      throw new Error('You do not have that many resources to spend');
    }
    const amountPaid = player.payingAmount(payment, this.paymentOptions);
    if (amountPaid < this.amount) {
      throw new Error('Did not spend enough');
    }
    return this.cb(input.payment);
  }
}
