import {InputRequestType} from '../../common/input/InputRequestType';
import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';

export abstract class OptionsInput<T> extends BasePlayerInput<T> {
  public options: Array<PlayerInput>;
  constructor(type: InputRequestType, title: string | Message, options: Array<PlayerInput>) {
    super(type, title);
    this.options = options;
  }
}
