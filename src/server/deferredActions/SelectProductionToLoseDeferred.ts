import {SelectProductionToLose} from '../inputs/SelectProductionToLose';
import {IPlayer} from '../IPlayer';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {Units} from '../../common/Units';

export class SelectProductionToLoseDeferred extends DeferredAction {
  constructor(
    player: IPlayer,
    private unitsToLose: number,
    private title: string = `Choose ${unitsToLose} unit(s) of production to lose`,
  ) {
    super(player, Priority.LOSE_RESOURCE_OR_PRODUCTION);
  }

  public execute() {
    return new SelectProductionToLose(
      this.title,
      this.unitsToLose,
      this.player)
      .andThen((production) => {
        this.player.production.adjust(Units.negative(production), {log: true});
        return undefined;
      });
  }
}
