import {BasePlayerInput} from '../PlayerInput';
import {InputResponse, isDeltaProjectInputResponse} from '../../common/inputs/InputResponse';
import {DeltaProjectInputModel} from '../../common/models/PlayerInputModel';
import {InputError} from '../inputs/InputError';

export class DeltaProjectInput extends BasePlayerInput<number> {
  constructor(
    public validSteps: ReadonlyArray<number>,
  ) {
    super('deltaProject', 'Select the amount of energy to spend to advance on the track');
    this.buttonLabel = 'Advance';
  }

  public toModel(): DeltaProjectInputModel {
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
