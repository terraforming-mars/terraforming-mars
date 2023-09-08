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
    if (!isPayment(input.payment)) {
      throw new Error('payment is not a valid type');
    }
    // TODO(kberg): This is called here and in SelectPaymentDeferred.
    // There's no reason for both.
    if (!player.canSpend(input.payment)) {
      throw new Error('You do not have that many resources');
    }
    return this.cb(input.payment);
  }
}
