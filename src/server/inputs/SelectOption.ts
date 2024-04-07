import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {BasePlayerInput} from '../PlayerInput';
import {InputResponse, isSelectOptionResponse} from '../../common/inputs/InputResponse';
import {SelectOptionModel} from '../../common/models/PlayerInputModel';
import {Warning} from '../../common/cards/Warning';
import {InputError} from './InputError';

export class SelectOption extends BasePlayerInput<undefined> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Confirm') {
    super('option', title);
    this.buttonLabel = buttonLabel;
  }

  public warnings: Array<Warning> | undefined = undefined;

  public override toModel(): SelectOptionModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'option',
      warnings: this.warnings,
    };
  }
  public process(response: InputResponse): PlayerInput | undefined {
    if (!isSelectOptionResponse(response)) {
      throw new InputError('Not a valid SelectOptionResponse');
    }
    return this.cb(undefined);
  }
}
