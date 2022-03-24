
import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {IColony} from '../colonies/IColony';

export class SelectColony implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_COLONY;

  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Save',
        public colonies: Array<IColony>,
        public cb: (colony: IColony) => PlayerInput | undefined,
  ) {
    this.buttonLabel = buttonLabel;
  }
}
