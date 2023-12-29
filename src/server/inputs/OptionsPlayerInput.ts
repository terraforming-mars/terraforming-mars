import {InputRequestType} from '../../common/input/InputRequestType';
import {Message} from '../../common/logs/Message';
import {BaseInputRequest, InputRequest} from '../InputRequest';

export abstract class OptionsInput<T> extends BaseInputRequest<T> {
  public options: Array<InputRequest>;
  constructor(type: InputRequestType, title: string | Message, options: Array<InputRequest>) {
    super(type, title);
    this.options = options;
  }
}
