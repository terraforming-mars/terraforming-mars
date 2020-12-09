import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {IProductionUnits} from './IProductionUnits';
import {Player} from '../Player';

export class SelectProductionToLose implements PlayerInput {
    public inputType = PlayerInputTypes.SELECT_PRODUCTION_TO_LOSE;

    constructor(
        public title: string | Message,
        public unitsToLose: number,
        public player: Player,
        public cb: (units: IProductionUnits) => PlayerInput | undefined,
        public buttonLabel: string = 'Save',
    ) {
      this.buttonLabel = buttonLabel;
    }
}
