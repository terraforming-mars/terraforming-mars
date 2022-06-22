
import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {HowToPay} from '../common/inputs/HowToPay';
import {SelectSpace} from './SelectSpace';
import {OrOptions} from './OrOptions';
import {SelectOption} from './SelectOption';
import {InputResponse} from '../common/inputs/InputResponse';
import {Player} from '../Player';

export class SelectHowToPay implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_HOW_TO_PAY;
  public buttonLabel: string = 'Pay'; // no input button
  constructor(
        public title: string | Message,
        public canUseSteel: boolean,
        public canUseTitanium: boolean,
        public canUseHeat: boolean,
        public canUseSeeds: boolean,
        public canUseData: boolean,
        public amount: number,
        public cb: (howToPay: HowToPay) => SelectSpace | SelectOption| OrOptions | undefined,
  ) {
  }

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 1);
    const howToPay: HowToPay = player.parseHowToPayJSON(input[0][0]);
    return this.cb(howToPay);
  }
}
