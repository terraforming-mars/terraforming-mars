import {PlayerInputType} from '../../common/input/PlayerInputType';
import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';

export abstract class OptionsInput extends BasePlayerInput {
  public options: Array<PlayerInput>;
  constructor(inputType: PlayerInputType, title: string | Message, options: Array<PlayerInput>) {
    super(inputType, title);
    this.options = options;
  }
}
