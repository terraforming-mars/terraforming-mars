
import {Message} from '../Message';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';

export class SelectAmount implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_AMOUNT;
  constructor(
      public title: string | Message,
      public buttonLabel: string = 'Save',
      public cb: (amount: number) => undefined | PlayerInput,
      public min: number,
      public max: number,
  ) {
    this.buttonLabel = buttonLabel;
  }

  public runInput(player: Player, input: ReadonlyArray<ReadonlyArray<string>>) {
    PlayerInput.checkInputLength(input, 1, 1);
    const amount: number = parseInt(input[0][0]);
    if (isNaN(amount)) {
      throw new Error('Number not provided for amount');
    }
    if (amount > this.max) {
      throw new Error('Amount provided too high (max ' + String(this.max) + ')');
    }
    if (amount < this.min) {
      throw new Error('Amount provided too low (min ' + String(this.min) + ')');
    }
    player.runInputCb(this.cb(amount));
  }
}
