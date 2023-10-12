import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {DeferredAction, Priority} from './DeferredAction';

export type Options = {
  count?: number;
  cb?(): void;
  log?: boolean;
}

export class GainResources extends DeferredAction {
  constructor(
    player: IPlayer,
    public resource: Resource,
    public options: Options = {},
  ) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
    if ((options.count ?? 0) < 0) {
      throw new Error('GainResources count option must be >= 0');
    }
  }

  public execute() {
    if (this.options.count === 0) {
      return undefined;
    }
    this.player.stock.add(this.resource, this.options.count ?? 1, {log: this.options.log});
    this.options.cb?.();
    return undefined;
  }
}
