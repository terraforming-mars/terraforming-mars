import {Message} from '../../common/logs/Message';
import {InputRequest} from '../InputRequest';
import {BaseInputRequest} from '../InputRequest';
import {InputResponse, isSelectOptionResponse} from '../../common/inputs/InputResponse';
import {SelectOptionModel} from '../../common/models/InputRequestModel';

export class SelectOption extends BaseInputRequest<undefined> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Confirm') {
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
  public process(response: InputResponse): InputRequest | undefined {
    if (!isSelectOptionResponse(response)) {
      throw new Error('Not a valid SelectOptionResponse');
    }
    return this.cb(undefined);
  }
}
