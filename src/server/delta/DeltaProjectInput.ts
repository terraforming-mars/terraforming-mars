import {BasePlayerInput} from '../PlayerInput';
import {InputResponse, isDeltaProjectInputResponse} from '../../common/inputs/InputResponse';
import {DeltaProjectInputModel} from '../../common/models/PlayerInputModel';
import {InputError} from '../inputs/InputError';

export class DeltaProjectInput extends BasePlayerInput<number> {
  /**
   * @param validSteps the legal step counts the player may submit. Each value
   * is both the number of track positions to advance and the energy cost.
   * Sparse (not always `[1..max]`) when an opponent occupies a VP spot —
   * e.g. `[1, 3]` if a 2-step advance would land on a blocked space.
   */
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
    if (!this.validSteps.includes(input.amount)) {
      throw new InputError('Amount must be one of: ' + this.validSteps.join(', '));
    }
    return this.cb(input.amount);
  }
}
