import {PlayerInputType} from '../../common/input/PlayerInputType';
import {Message} from '../../common/logs/Message';
import {BasePlayerInputAndThen, PlayerInput} from '../PlayerInput';

export abstract class OptionsInput<T> extends BasePlayerInputAndThen<T> {
  public options: Array<PlayerInput>;
  constructor(type: PlayerInputType, title: string | Message, options: Array<PlayerInput>) {
    super(type, title);
    this.options = options;
  }
}
