
import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {HowToPay} from './HowToPay';
import {SelectSpace} from './SelectSpace';
import {OrOptions} from './OrOptions';
import {SelectOption} from './SelectOption';
import {Player} from '../Player';

export class SelectHowToPay implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_HOW_TO_PAY;
    public buttonLabel: string = 'Pay'; // no input button
    constructor(
        public title: string | Message,
        public canUseSteel: boolean,
        public canUseTitanium: boolean,
        public canUseHeat: boolean,
        public amount: number,
        public cb: (howToPay: HowToPay) => SelectSpace | SelectOption| OrOptions | undefined,
    ) {
    }

    public runInput(player: Player, input: ReadonlyArray<ReadonlyArray<string>>): void {
      PlayerInput.checkInputLength(input, 1, 1);
      const howToPay: HowToPay = Player.parseHowToPayJSON(input[0][0]);
      player.runInputCb(this.cb(howToPay));
    }
}

