import {Message} from '../../common/logs/Message';
import {Units} from '../../common/Units';
import {BasePlayerInput} from '../PlayerInput';
import {SelectResourcesModel} from '../../common/models/PlayerInputModel';
import {InputResponse, isSelectResourcesResponse} from '../../common/inputs/InputResponse';
import {InputError} from './InputError';
import {sum} from '../../common/utils/utils';

export class SelectResources extends BasePlayerInput<Units> {
  constructor(
    public override title: string | Message,
    public count: number,
    public override buttonLabel: string = 'Select',
  ) {
    super('resources', title);
  }

  public override toModel(): SelectResourcesModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'resources',
      count: this.count,
    };
  }

  public process(input: InputResponse) {
    if (!isSelectResourcesResponse(input)) {
      throw new InputError('Not a valid SelectResourcesResponse');
    }
    const array = Object.values(input.units);
    if (array.some((count) => count < 0)) {
      throw new InputError('All units must be positive');
    }
    if (sum(array) !== this.count) {
      throw new InputError(`Select ${this.count} resource(s)`);
    }
    return this.cb(input.units);
  }
}
