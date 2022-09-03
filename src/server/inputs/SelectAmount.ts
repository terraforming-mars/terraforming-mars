
import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {InputResponse} from '../../common/inputs/InputResponse';
import {Player} from '../Player';

export class SelectAmount implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_AMOUNT;
  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Save',
        public cb: (amount: number) => undefined | PlayerInput,
        public min: number,
        public max: number,
        public maxByDefault?: boolean,
  ) {
    this.buttonLabel = buttonLabel;
  }

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 1);
    const amount = parseInt(input[0][0]);
    if (isNaN(amount)) {
      throw new Error('Amount is not a number');
    }
    if (amount > this.max) {
      throw new Error('Amount provided too high (max ' + String(this.max) + ')');
    }
    if (amount < this.min) {
      throw new Error('Amount provided too low (min ' + String(this.min) + ')');
    }
    return this.cb(amount);
  }
}
