import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';

export class SelectOption implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_OPTION;
    constructor(
        public title: string | Message,
        public buttonLabel: string = 'Select',
        public cb: () => PlayerInput | undefined) {
      this.buttonLabel = buttonLabel;
    }
}

