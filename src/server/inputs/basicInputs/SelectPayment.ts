import {Message} from '../../../common/logs/Message';
import {BasePlayerInput} from '../../PlayerInput';
import {Payment, PaymentOptions} from '../../../common/inputs/Payment';
import {InputResponse, SelectPaymentResponse} from '../../../common/inputs/InputResponse';
import {IPlayer} from '../../IPlayer';
import {SelectPaymentModel} from '../../../common/models/PlayerInputModel';
import { PlayerInputType } from '@/common/input/PlayerInputType';

export class SelectPayment extends BasePlayerInput<Payment> {
  constructor(
    title: string | Message,
    public amount: number,
    public paymentOptions: PaymentOptions,
  ) {
    super(PlayerInputType.PAYMENT, title);
    this.buttonLabel = 'Pay';
  }

  public toModel(_player: IPlayer): SelectPaymentModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: PlayerInputType.PAYMENT,
      amount: this.amount,
      paymentOptions: this.paymentOptions,
    };
  }

  public process(response: InputResponse, player: IPlayer) {
    let typedResponse = this.ResponseAsType<SelectPaymentResponse>(response);
    player.ValidatePayment(this.paymentOptions, typedResponse.payment, this.amount);
    player.pay(typedResponse.payment)
    return this.cb(typedResponse.payment);
  }
}
