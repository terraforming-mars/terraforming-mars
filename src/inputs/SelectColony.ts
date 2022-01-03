
import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {Colony} from '../colonies/Colony';

export class SelectColony implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_COLONY;

    constructor(
        public title: string | Message,
        public buttonLabel: string = 'Save',
        public colonies: Array<Colony>,
        public cb: (colony: Colony) => PlayerInput | undefined,
    ) {
      this.buttonLabel = buttonLabel;
    }
}
