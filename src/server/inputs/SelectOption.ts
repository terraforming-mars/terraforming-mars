import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {BasePlayerInput} from '../PlayerInput';
import {InputResponse, isSelectOptionResponse} from '../../common/inputs/InputResponse';
import {SelectOptionModel} from '../../common/models/PlayerInputModel';
import {Warning} from '../../common/cards/Warning';
import {InputError} from './InputError';

export type Options = {
  buttonLabel?: string;
  warnings?: Array<Warning>;
}

export class SelectOption extends BasePlayerInput<undefined> {
  constructor(
    title: string | Message,
    options: string | Options = 'Confirm') {
    super('option', title);
    if (typeof options === 'string') {
      this.buttonLabel = options;
    } else {
      this.buttonLabel = options.buttonLabel ?? 'Confirm';
      this.warnings = options.warnings;
    }
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
