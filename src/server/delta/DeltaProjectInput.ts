import {Message} from '../../common/logs/Message';
import {BasePlayerInput} from '../PlayerInput';
import {InputResponse, isDeltaProjectInputResponse} from '../../common/inputs/InputResponse';
import {DeltaProjectInputModel} from '../../common/models/PlayerInputModel';
import {DeltaProjectModel} from '../../common/models/DeltaProjectModel';
import {IPlayer} from '../IPlayer';
import {InputError} from '../inputs/InputError';

export class DeltaProjectInput extends BasePlayerInput<number> {
  constructor(
    title: string | Message,
    buttonLabel: string,
    public min: number,
    public max: number,
    public deltaProjectModel: DeltaProjectModel,
  ) {
    super('deltaProject', title);
    this.buttonLabel = buttonLabel;
  }

  public toModel(_player?: IPlayer): DeltaProjectInputModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'deltaProject',
      min: this.min,
      max: this.max,
      deltaProjectModel: this.deltaProjectModel,
    };
  }

  public process(input: InputResponse) {
    if (!isDeltaProjectInputResponse(input)) {
      throw new InputError('Not a valid DeltaProjectInputResponse');
    }
    if (isNaN(input.amount)) {
      throw new InputError('Amount is not a number');
    }
    if (input.amount > this.max) {
      throw new InputError('Amount provided too high (max ' + String(this.max) + ')');
    }
    if (input.amount < this.min) {
      throw new InputError('Amount provided too low (min ' + String(this.min) + ')');
    }
    return this.cb(input.amount);
  }
}
