import {SelectProductionToLose} from '../inputs/SelectProductionToLose';
import {Player} from '../Player';
import {DeferredAction} from './DeferredAction';
import {Units} from '../Units';

export class SelectProductionToLoseDeferred implements DeferredAction {
  constructor(
        public player: Player,
        private unitsToLose: number,
        private title: string = `Choose ${unitsToLose} unit(s) of production to lose`,
  ) {}

  public execute() {
    return new SelectProductionToLose(
      this.title,
      this.unitsToLose,
      this.player,
      (production: Units) => {
        Units.deductProduction(production, this.player, this.player.game);
        return undefined;
      },
    );
  }
}
