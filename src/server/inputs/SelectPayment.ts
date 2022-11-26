import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {isPayment, Payment} from '../../common/inputs/Payment';
import {InputResponse, isSelectPaymentResponse} from '../../common/inputs/InputResponse';
import {Player} from '../Player';

export class SelectPayment implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_PAYMENT;
  public buttonLabel: string = 'Pay'; // no input button
  constructor(
        public title: string | Message,
        public canUseSteel: boolean,
        public canUseTitanium: boolean,
        public canUseHeat: boolean,
        public canUseSeeds: boolean,
        public canUseData: boolean,
        public canUseLunaTradeFederationTitanium: boolean,
        public amount: number,
        public cb: (payment: Payment) => PlayerInput | undefined,
  ) {
  }

  public process(input: InputResponse, player: Player) {
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
