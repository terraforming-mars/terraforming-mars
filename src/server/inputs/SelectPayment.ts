import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../../common/input/PlayerInputTypes';
import {jsonToPayment, Payment} from '../../common/inputs/Payment';
import {InputResponse} from '../../common/inputs/InputResponse';
import {Player} from '../Player';

export class SelectPayment implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_PAYMENT;
  public buttonLabel: string = 'Pay'; // no input button
  constructor(
        public title: string | Message,
        public canUseSteel: boolean,
        public canUseTitanium: boolean,
        public canUseHeat: boolean,
        public canUseSeeds: boolean,
        public canUseData: boolean,
        public amount: number,
        public cb: (payment: Payment) => PlayerInput | undefined,
  ) {
  }

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 1);
    const payment: Payment = jsonToPayment(input[0][0]);
    if (!player.canSpend(payment)) {
      throw new Error('You do not have that many resources');
    }
    return this.cb(payment);
  }
}
