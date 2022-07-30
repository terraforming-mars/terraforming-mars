import {Player} from '../Player';
import {Resources} from '../common/Resources';
import {DeferredAction, Priority} from './DeferredAction';
import {LogBuilder} from '../LogBuilder';

export namespace LoseProduction {
  export interface Options {
    count?: number;
    logMessage?: string;
    logBuilder?: (builder: LogBuilder) => void;
  }
}

export class LoseProduction extends DeferredAction {
  constructor(
    player: Player,
    public resource: Resources,
    public options: LoseProduction.Options = {},
  ) {
    super(player, Priority.LOSE_RESOURCE_OR_PRODUCTION);
  }

  public execute() {
    if (this.options.count === undefined) {
      this.options.count = 1;
    } else if (this.options.count < 0) {
      throw new Error('LoseProduction count option must be >= 0');
    } else if (this.options.count === 0) {
      return undefined;
    }
    this.player.addProduction(this.resource, -this.options.count);
    if (this.options.logMessage !== undefined) {
      this.player.game.log(this.options.logMessage, this.options.logBuilder);
    }
    return undefined;
  }
}
