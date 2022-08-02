import {Player} from '../Player';
import {Resources} from '../common/Resources';
import {DeferredAction, Priority} from './DeferredAction';

export namespace GainResources {
  export interface Options {
    count?: number;
    cb?: () => void;
    log?: boolean;
  }
}

export class GainResources extends DeferredAction {
  constructor(
    player: Player,
    public resource: Resources,
    public options: GainResources.Options = {},
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
    this.player.addResource(this.resource, this.options.count ?? 1, {log: this.options.log});
    if (this.options.cb) {
      this.options.cb();
    }
    return undefined;
  }
}
