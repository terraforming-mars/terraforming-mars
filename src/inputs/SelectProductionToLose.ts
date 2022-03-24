import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {Player} from '../Player';
import {Units} from '../common/Units';

export class SelectProductionToLose implements PlayerInput {
  public inputType = PlayerInputTypes.SELECT_PRODUCTION_TO_LOSE;

  constructor(
        public title: string | Message,
        public unitsToLose: number,
        public player: Player,
        public cb: (units: Units) => PlayerInput | undefined,
        public buttonLabel: string = 'Save',
  ) {
    this.buttonLabel = buttonLabel;
  }
}
