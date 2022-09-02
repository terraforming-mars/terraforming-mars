import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {Player} from '../Player';
import {Units} from '../../common/Units';
import {InputResponse} from '../../common/inputs/InputResponse';

export class SelectProductionToLose implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_PRODUCTION_TO_LOSE;

  constructor(
        public title: string | Message,
        public unitsToLose: number,
        public player: Player,
        public cb: (units: Units) => PlayerInput | undefined,
        public buttonLabel: string = 'Save',
  ) {
    this.buttonLabel = buttonLabel;
  }

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 1);
    const units: Units = this.parseUnitsJSON(input[0][0]);
    if (!Units.keys.every((k) => units[k] >= 0)) {
      throw new Error('All units must be positive');
    }
    if (!player.production.canAdjust(Units.negative(units))) {
      throw new Error('You do not have those units');
    }
    this.cb(units);
    return undefined;
  }

  private parseUnitsJSON(json: string): Units {
    try {
      const units: unknown = JSON.parse(json);
      if (!Units.isUnits(units)) {
        throw new Error('not a units object');
      }

      return units;
    } catch (err) {
      throw new Error('Unable to parse Units input ' + err);
    }
  }
}
