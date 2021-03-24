import {Message} from '../Message';
import {Player} from '../Player';
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

    public runInput(player: Player, _input: ReadonlyArray<ReadonlyArray<string>>) {
      player.runInputCb(this.cb());
    }
}

