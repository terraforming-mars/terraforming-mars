import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {BasePlayerInputAndThen} from './BasePlayerInputAndThen';
import {InputResponse, isSelectOptionResponse} from '../../common/inputs/InputResponse';
import {SelectOptionModel} from '../../common/models/PlayerInputModel';

export class SelectOption extends BasePlayerInputAndThen<undefined> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Select') {
    super('option', title);
    this.buttonLabel = buttonLabel;
  }

  public override toModel(): SelectOptionModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'option',
    };
  }
  public process(response: InputResponse): PlayerInput | undefined {
    if (!isSelectOptionResponse(response)) {
      throw new Error('Not a valid SelectOptionResponse');
    }
    return this.cb(undefined);
  }
}
