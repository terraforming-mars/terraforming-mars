import {IPlayer} from '../IPlayer';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {Units} from '../../common/Units';

export class AdjustProduction extends DeferredAction {
  constructor(
    player: IPlayer,
    public units: Units,
  ) {
    super(player, Priority.LOSE_RESOURCE_OR_PRODUCTION);
  }

  public execute() {
    this.player.production.adjust(this.units);
    return undefined;
  }
}
