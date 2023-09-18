import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {isPayment, Payment} from '../../common/inputs/Payment';
import {InputResponse, isSelectPaymentResponse} from '../../common/inputs/InputResponse';
import {IPlayer} from '../IPlayer';

export class SelectPayment extends BasePlayerInput {
  constructor(
    title: string | Message,
    public amount: number,
    public canUse: {
      steel?: boolean,
      titanium?: boolean,
      heat?: boolean,
      seeds?: boolean,
      data?: boolean,
      lunaTradeFederationTitanium?: boolean,
      graphene?: boolean,
      kuiperAsteroids?: boolean,
    },
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
    const amountPaid = player.payingAmount(payment, {
      steel: this.canUse.steel,
      titanium: this.canUse.titanium,
      seeds: this.canUse.seeds,
      floaters: false, // Used in project cards only
      microbes: false, // Used in project cards only
      science: false, // Used in project cards only
      auroraiData: this.canUse.data,
      kuiperAsteroids: this.canUse.kuiperAsteroids,
    });
    if (amountPaid < this.amount) {
      throw new Error('Did not spend enough');
    }
    return this.cb(input.payment);
  }
}
