import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {InputResponse, isAndOptionsResponse} from '../../common/inputs/InputResponse';
import {IPlayer} from '../IPlayer';

export class AndOptions extends BasePlayerInput {
  public options: Array<PlayerInput>;
  constructor(public cb: () => PlayerInput | undefined, ...options: Array<PlayerInput>) {
    super('and');
    this.options = options;
  }

  public process(input: InputResponse, player: IPlayer) {
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
