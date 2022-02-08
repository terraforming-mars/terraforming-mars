import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';

export class SelectOption implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_OPTION;
  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Select',
        public cb: () => PlayerInput | undefined) {
    this.buttonLabel = buttonLabel;
  }
}

