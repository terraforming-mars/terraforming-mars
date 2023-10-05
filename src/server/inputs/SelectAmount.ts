import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {InputResponse, isSelectAmountResponse} from '../../common/inputs/InputResponse';
import {SelectAmountModel} from '../../common/models/PlayerInputModel';

export class SelectAmount extends BasePlayerInput {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    public cb: (amount: number) => undefined | PlayerInput,
    public min: number,
    public max: number,
    public maxByDefault?: boolean,
  ) {
    super('amount', title);
    this.buttonLabel = buttonLabel;
  }

  public toModel(): SelectAmountModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'amount',
      max: this.max,
      min: this.min,
      maxByDefault: this.maxByDefault ?? false,
    };
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
