import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {InputResponse} from '../common/inputs/InputResponse';
import {Player} from '../Player';

export class SelectOption implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_OPTION;
  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Select',
        public cb: () => PlayerInput | undefined) {
    this.buttonLabel = buttonLabel;
  }

  public process(_response: InputResponse, _player: Player): PlayerInput | undefined {
    return this.cb();
  }
}
