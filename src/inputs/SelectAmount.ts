
import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';

export class SelectAmount implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_AMOUNT;
    constructor(
        public title: string | Message,
        public buttonLabel: string = 'Save',
        public cb: (amount: number) => undefined,
        public min: number,
        public max: number,
    ) {
      this.buttonLabel = buttonLabel;
    }
}
