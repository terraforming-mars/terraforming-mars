import {Player} from '../Player';
import {Resources} from '../Resources';
import {DeferredAction, Priority} from './DeferredAction';
import {LogBuilder} from '../LogBuilder';

export namespace GainResources {
  export interface Options {
    count?: number;
    logMessage?: string;
    logBuilder?: (builder: LogBuilder) => void;
  }
}

export class GainResources implements DeferredAction {
  public priority = Priority.GAIN_RESOURCE_OR_PRODUCTION;
  constructor(
    public player: Player,
    public resource: Resources,
    public options: GainResources.Options = {},
  ) {}

  public execute() {
    if (this.options.count === undefined) {
      this.options.count = 1;
    } else if (this.options.count < 0) {
      throw new Error('GainResources count option must be >= 0');
    } else if (this.options.count === 0) {
      return undefined;
    }
    this.player.addResource(this.resource, this.options.count);
    if (this.options.logMessage !== undefined) {
      this.player.game.log(this.options.logMessage, this.options.logBuilder);
    }
    return undefined;
  }
}
