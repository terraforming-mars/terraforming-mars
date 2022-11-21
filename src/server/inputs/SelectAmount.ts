
import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {InputResponse, isSelectAmountResponse} from '../../common/inputs/InputResponse';

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

  public process(input: InputResponse) {
    if (!isSelectAmountResponse(input)) {
      throw new Error('Not a valid SelectAmountResponse');
    }
    if (isNaN(input.amount)) {
      throw new Error('Amount is not a number');
    }
    if (input.amount > this.max) {
      throw new Error('Amount provided too high (max ' + String(this.max) + ')');
    }
    if (input.amount < this.min) {
      throw new Error('Amount provided too low (min ' + String(this.min) + ')');
    }
    return this.cb(input.amount);
  }
}
