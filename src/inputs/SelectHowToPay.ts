
import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {HowToPay} from '../common/inputs/HowToPay';
import {SelectSpace} from './SelectSpace';
import {OrOptions} from './OrOptions';
import {SelectOption} from './SelectOption';

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
}
