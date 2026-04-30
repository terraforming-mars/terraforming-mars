import {Message} from '../../common/logs/Message';
import {BasePlayerInput} from '../PlayerInput';
import {InputResponse, isDeltaProjectInputResponse} from '../../common/inputs/InputResponse';
import {DeltaProjectInputModel} from '../../common/models/PlayerInputModel';
import {IPlayer} from '../IPlayer';
import {InputError} from '../inputs/InputError';

export class DeltaProjectInput extends BasePlayerInput<number> {
  constructor(
    title: string | Message,
    buttonLabel: string,
    public validSteps: ReadonlyArray<number>,
  ) {
    super('deltaProject', title);
    this.buttonLabel = buttonLabel;
  }

  public toModel(_player?: IPlayer): DeltaProjectInputModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'deltaProject',
      validSteps: this.validSteps,
    };
  }

  public process(input: InputResponse) {
    if (!isDeltaProjectInputResponse(input)) {
      throw new InputError('Not a valid DeltaProjectInputResponse');
    }
    if (isNaN(input.amount)) {
      throw new InputError('Amount is not a number');
    }
    if (!this.validSteps.includes(input.amount)) {
      throw new InputError('Amount must be one of: ' + this.validSteps.join(', '));
    }
    return this.cb(input.amount);
  }
}
