import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {Message} from '../../common/logs/Message';
import {InputResponse, isOrOptionsResponse} from '../../common/inputs/InputResponse';
import {Player} from '../Player';

export class OrOptions implements PlayerInput {
  public cb(): PlayerInput | undefined {
    return undefined;
  }
  public title: string | Message = 'Select one option';
  public buttonLabel: string = 'Save';
  public options: Array<PlayerInput>;
  public readonly inputType = PlayerInputType.OR_OPTIONS;
  constructor(
    ...options: Array<PlayerInput>
  ) {
    this.options = options;
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
