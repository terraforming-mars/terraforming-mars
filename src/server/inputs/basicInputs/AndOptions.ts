import {PlayerInput} from '../../PlayerInput';
import {AndOptionsResponse, InputResponse} from '../../../common/inputs/InputResponse';
import {IPlayer} from '../../IPlayer';
import {AndOptionsModel} from '../../../common/models/PlayerInputModel';
import {OptionsInput} from './OptionsPlayerInput';
import { PlayerInputType } from '@/common/input/PlayerInputType';
import { Message } from '@/common/logs/Message';

export class AndOptions extends OptionsInput<undefined> {
  constructor(title: string | Message, ...options: Array<PlayerInput>) {
    super(PlayerInputType.AND, title, options);
  }

  // TODO(kberg): Detach AndOptions and SelectInitialCards.
  public toModel(player: IPlayer): AndOptionsModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: PlayerInputType.AND,
      options: this.options.map((option) => option.toModel(player)),
    };
  }

  public process(response: InputResponse, player: IPlayer) {
    let typedResponse = this.ResponseAsType<AndOptionsResponse>(response);
    if (typedResponse.responses.length !== this.options.length) {
      throw new Error('Incorrect options provided');
    }
    for (let i = 0; i < typedResponse.responses.length; i++) {
      player.runInput(typedResponse.responses[i], this.options[i]);
    }
    return this.cb(undefined);
  }
}
