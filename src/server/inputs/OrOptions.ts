import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {InputResponse, isOrOptionsResponse} from '../../common/inputs/InputResponse';
import {Player} from '../Player';
import {OptionsInput} from './OptionsInput';

export class OrOptions extends OptionsInput {
  public cb(): PlayerInput | undefined {
    return undefined;
  }
  constructor(...options: Array<PlayerInput>) {
    super(PlayerInputType.OR_OPTIONS, options, 'Select one option');
  }

  public process(input: InputResponse, player: Player) {
    if (!isOrOptionsResponse(input)) {
      throw new Error('Not a valid OrOptionsResponse');
    }
    if (this.options.length <= input.index) {
      throw new Error('Invalid index');
    }
    player.runInput(input.response, this.options[input.index]);
    return this.cb();
  }
}
