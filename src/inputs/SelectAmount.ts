
import {DynamicTranslatableStringModel} from '../models/DynamicTranslatableStringModel';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';

export class SelectAmount implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_AMOUNT;
    constructor(
        public title: string | DynamicTranslatableStringModel,
        public buttonLabel: string = 'Save',
        public cb: (amount: number) => undefined,
        public max: number) {
      this.buttonLabel = buttonLabel;
    }
}
