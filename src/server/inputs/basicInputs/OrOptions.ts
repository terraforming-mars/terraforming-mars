import {PlayerInput} from '../../PlayerInput';
import {InputResponse, OrOptionsResponse} from '../../../common/inputs/InputResponse';
import {IPlayer} from '../../IPlayer';
import {OrOptionsModel} from '../../../common/models/PlayerInputModel';
import {OptionsInput} from './OptionsPlayerInput';
import { PlayerInputType } from '@/common/input/PlayerInputType';

export class OrOptions extends OptionsInput<undefined> {
  constructor(...options: Array<PlayerInput>) {
    super(PlayerInputType.OR, 'Select one option', options);
  }

  public toModel(player: IPlayer): OrOptionsModel {
    const initialIdx = this.options.findIndex((option) => option.eligibleForDefault !== false);
    const model: OrOptionsModel = {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: PlayerInputType.OR,
      options: this.options.map((option) => option.toModel(player)),
    };
    if (initialIdx > -1) {
      model.initialIdx = initialIdx;
    }
    return model;
  }

  public process(response: InputResponse, player: IPlayer) {
    let typedResponse = this.ResponseAsType<OrOptionsResponse>(response);
    if (this.options.length <= typedResponse.index) {
      throw new Error('Invalid index');
    }
    player.runInput(typedResponse.response, this.options[typedResponse.index]);
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
