import {Message} from '../../common/logs/Message';
import {BasePlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {Units} from '../../common/Units';
import {InputResponse, isSelectProductionToLoseResponse} from '../../common/inputs/InputResponse';
import {sum} from '../../common/utils/utils';
import {SelectProductionToLoseModel} from '../../common/models/PlayerInputModel';

export class SelectProductionToLose extends BasePlayerInput<Units> {
  constructor(
    title: string | Message,
    public unitsToLose: number,
    public player: IPlayer,
    buttonLabel: string = 'Save',
  ) {
    super('productionToLose', title);
    this.buttonLabel = buttonLabel;
  }

  public override toModel(): SelectProductionToLoseModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'productionToLose',
      payProduction: {
        cost: this.unitsToLose,
        units: this.player.production.asUnits(),
      },
    };
  }
  // TODO(kberg): Could merge this with SelectResources, though it
  // would take some work.
  public process(input: InputResponse, player: IPlayer) {
    if (!isSelectProductionToLoseResponse(input)) {
      throw new Error('Not a valid SelectProductionToLoseResponse');
    }
    if (!Units.isUnits(input.units)) {
      throw new Error('not a units object');
    }
    const array = Object.values(input.units);
    if (array.some((count) => count < 0)) {
      throw new Error('All units must be positive');
    }
    if (!player.production.canAdjust(Units.negative(input.units))) {
      throw new Error('You do not have those units');
    }
    if (sum(array) !== this.unitsToLose) {
      throw new Error(`Select ${this.unitsToLose} steps of production.`);
    }
    this.cb(input.units);
    return undefined;
  }
}
