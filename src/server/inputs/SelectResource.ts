import {Message} from '../../common/logs/Message';
import {Units} from '../../common/Units';
import {BasePlayerInput} from '../PlayerInput';
import {SelectResourceModel} from '../../common/models/PlayerInputModel';
import {InputResponse, isSelectResourceResponse} from '../../common/inputs/InputResponse';
import {InputError} from './InputError';

export class SelectResource extends BasePlayerInput<keyof Units> {
  public selected: keyof Units = 'megacredits';

  constructor(
    public override title: string | Message,
    public include: ReadonlyArray<keyof Units> = Units.keys,
    public override buttonLabel: string = 'Select',
  ) {
    super('resource', title);
  }

  public override toModel(): SelectResourceModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'resource',
      include: this.include,
    };
  }

  public process(input: InputResponse) {
    if (!isSelectResourceResponse(input)) {
      throw new InputError('Not a valid SelectResourceResponse');
    }
    if (!this.include.includes(input.resource)) {
      throw new InputError('Not a valid unit');
    }
    this.selected = input.resource;
    return this.cb(input.resource);
  }
}
