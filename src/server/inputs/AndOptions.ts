import {PlayerInput} from '../PlayerInput';
import {InputResponse, isAndOptionsResponse} from '../../common/inputs/InputResponse';
import {IPlayer} from '../IPlayer';
import {AndOptionsModel} from '../../common/models/PlayerInputModel';
import {OptionsInput} from './OptionsPlayerInput';
import {InputError} from './InputError';

export class AndOptions extends OptionsInput<undefined> {
  constructor(...options: Array<PlayerInput>) {
    super('and', '', options);
  }

  public toModel(player: IPlayer): AndOptionsModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'and',
      options: this.options.map((option) => option.toModel(player)),
    };
  }

  public process(input: InputResponse, player: IPlayer) {
    if (!isAndOptionsResponse(input)) {
      throw new InputError('Not a valid AndOptionsResponse');
    }
    if (input.responses.length !== this.options.length) {
      throw new InputError('Incorrect options provided');
    }
    for (let i = 0; i < input.responses.length; i++) {
      player.runInput(input.responses[i], this.options[i]);
    }
    return this.cb(undefined);
  }
}
