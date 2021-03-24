import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {Player} from '../Player';
import {Units} from '../Units';

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

    public runInput(player: Player, input: ReadonlyArray<ReadonlyArray<string>>) {
      // TODO(kberg): I'm sure there's some input validation required.
      const units: Units = JSON.parse(input[0][0]);
      player.runInputCb(this.cb(units));
    }
}
