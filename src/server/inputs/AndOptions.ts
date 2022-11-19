import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {InputResponse, isAndOptionsResponse} from '../../common/inputs/InputResponse';
import {Player} from '../Player';

export class AndOptions implements PlayerInput {
  public readonly inputType: PlayerInputType = PlayerInputType.AND_OPTIONS;
  public title = '';
  public buttonLabel: string = 'Save';
  public options: Array<PlayerInput>;
  constructor(public cb: () => PlayerInput | undefined, ...options: Array<PlayerInput>) {
    this.options = options;
  }

  public process(input: InputResponse, player: Player) {
    if (!isAndOptionsResponse(input)) {
      throw new Error('Not a valid AndOptionsResponse');
    }
    if (input.responses.length !== this.options.length) {
      throw new Error('Incorrect options provided');
    }
    for (let i = 0; i < input.responses.length; i++) {
      player.runInput(input.responses[i], this.options[i]);
    }
    return this.cb();
  }
}
