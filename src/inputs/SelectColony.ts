
import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
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
