import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {InputResponse, isSelectAmountResponse} from '../../common/inputs/InputResponse';
import {PlayerInputModel} from '../../common/models/PlayerInputModel';

export class SelectAmount extends BasePlayerInput {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    public cb: (amount: number) => undefined | PlayerInput,
    public min: number,
    public max: number,
    public maxByDefault?: boolean,
  ) {
    super(PlayerInputType.SELECT_CARD, title);
    this.buttonLabel = buttonLabel;
  }

  public override toModel(model: PlayerInputModel) {
    model.min = this.min;
    model.max = this.max;
    model.maxByDefault = this.maxByDefault;
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
