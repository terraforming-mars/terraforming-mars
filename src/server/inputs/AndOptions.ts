import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {InputResponse} from '../../common/inputs/InputResponse';
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
    player.checkInputLength(input, this.options.length);
    for (let i = 0; i < input.length; i++) {
      player.runInput([input[i]], this.options[i]);
    }
    return this.cb();
  }
}
