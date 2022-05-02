
import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {InputResponse} from '../common/inputs/InputResponse';
import {Player} from '../Player';

export class SelectAmount implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_AMOUNT;
  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Save',
        public cb: (amount: number) => undefined | PlayerInput,
        public min: number,
        public max: number,
        public maxByDefault?: boolean,
  ) {
    this.buttonLabel = buttonLabel;
  }

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 1);
    const amount = parseInt(input[0][0]);
    if (isNaN(amount)) {
      throw new Error('Amount is not a number');
    }
    return this.cb(amount);
  }
}
