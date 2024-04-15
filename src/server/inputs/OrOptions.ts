import {PlayerInput} from '../PlayerInput';
import {InputResponse, isOrOptionsResponse} from '../../common/inputs/InputResponse';
import {IPlayer} from '../IPlayer';
import {OrOptionsModel} from '../../common/models/PlayerInputModel';
import {OptionsInput} from './OptionsPlayerInput';
import {InputError} from './InputError';

export class OrOptions extends OptionsInput<undefined> {
  constructor(...options: Array<PlayerInput>) {
    super('or', 'Select one option', options);
  }

  public toModel(player: IPlayer): OrOptionsModel {
    const initialIdx = this.options.findIndex((option) => option.eligibleForDefault !== false);
    const model: OrOptionsModel = {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'or',
      options: this.options.map((option) => option.toModel(player)),
    };
    if (initialIdx > -1) {
      model.initialIdx = initialIdx;
    }
    return model;
  }

  public process(input: InputResponse, player: IPlayer) {
    if (!isOrOptionsResponse(input)) {
      throw new InputError('Not a valid OrOptionsResponse');
    }
    if (this.options.length <= input.index) {
      throw new InputError('Invalid index');
    }
    player.runInput(input.response, this.options[input.index]);
    return this.cb(undefined);
  }

  public reduce(): PlayerInput | undefined {
    if (this.options.length === 0) {
      return undefined;
    }
    if (this.options.length === 1) {
      return this.options[0].cb();
    }
    return this;
  }
}
