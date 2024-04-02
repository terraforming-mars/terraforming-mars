import {IPlayer} from '../IPlayer';
import {Units} from '../../common/Units';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';

export type Options = {
  cb?(): void;
  log?: boolean;
}

export class GainStock extends DeferredAction {
  constructor(
    player: IPlayer,
    public units: Units,
    public options: Options = {},
  ) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
    if (Units.values(this.units).some((v) => v < 0)) {
      throw new Error('GainStock does not accept negative unit values');
    }
  }

  public execute() {
    this.player.stock.addUnits(this.units, {log: this.options.log});
    this.options.cb?.();
    return undefined;
  }
}
