import {Message} from '../../../common/logs/Message';
import {BasePlayerInput} from '../../PlayerInput';
import {InputResponse, SelectAmountResponse} from '../../../common/inputs/InputResponse';
import {SelectAmountModel} from '../../../common/models/PlayerInputModel';
import { PlayerInputType } from '@/common/input/PlayerInputType';

export class SelectAmount extends BasePlayerInput<number> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    public min: number,
    public max: number,
    public maxByDefault?: boolean,
  ) {
    super(PlayerInputType.AMOUNT, title);
    this.buttonLabel = buttonLabel;
  }

  public toModel(): SelectAmountModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: PlayerInputType.AMOUNT,
      max: this.max,
      min: this.min,
      maxByDefault: this.maxByDefault ?? false,
    };
  }

  public process(response: InputResponse) {
    let typedResponse = this.ResponseAsType<SelectAmountResponse>(response);

    if (isNaN(typedResponse.amount)) {
      throw new Error('Amount is not a number');
    }
    if (typedResponse.amount > this.max) {
      throw new Error('Amount provided too high (max ' + String(this.max) + ')');
    }
    if (typedResponse.amount < this.min) {
      throw new Error('Amount provided too low (min ' + String(this.min) + ')');
    }
    return this.cb(typedResponse.amount);
  }
}
