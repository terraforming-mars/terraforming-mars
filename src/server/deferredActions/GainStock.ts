import {Player} from '../Player';
import {Units} from '../../common/Units';
import {DeferredAction, Priority} from './DeferredAction';

export type Options = {
  cb?: () => void;
  log?: boolean;
}

export class GainStock extends DeferredAction {
  constructor(
    player: Player,
    public units: Units,
    public options: Options = {},
  ) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
    if (Units.values(this.units).some((v) => v < 0)) {
      throw new Error('GainStock does not accept negative unit values');
    }
  }

  public execute() {
    this.player.addUnits(this.units, {log: this.options.log});
    this.options.cb?.();
    return undefined;
  }
}
