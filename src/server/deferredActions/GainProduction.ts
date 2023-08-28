import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {Priority, TailedDeferredAction} from './DeferredAction';

export type Options = {
  count?: number;
}

export class GainProduction extends TailedDeferredAction<undefined> {
  constructor(
    player: IPlayer,
    public resource: Resource,
    public options: Options = {},
  ) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
  }

  public execute() {
    if (this.options.count === undefined) {
      this.options.count = 1;
    } else if (this.options.count < 0) {
      throw new Error('GainProduction count option must be >= 0');
    }

    if (this.options.count > 0) {
      this.player.production.add(this.resource, this.options.count);
    }
    this.cb(undefined);
    return undefined;
  }
}
