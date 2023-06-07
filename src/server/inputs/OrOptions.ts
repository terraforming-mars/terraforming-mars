import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {InputResponse, isOrOptionsResponse} from '../../common/inputs/InputResponse';
import {IPlayer} from '../IPlayer';

export class OrOptions extends BasePlayerInput {
  public cb(): PlayerInput | undefined {
    return undefined;
  }
  public options: Array<PlayerInput>;
  constructor(...options: Array<PlayerInput>) {
    super('or', 'Select one option');
    this.options = options;
  }

  public process(input: InputResponse, player: IPlayer) {
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
