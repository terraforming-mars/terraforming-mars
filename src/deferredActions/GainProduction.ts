import {Player} from '../Player';
import {Resources} from '../Resources';
import {DeferredAction, Priority} from './DeferredAction';
import {LogBuilder} from '../LogBuilder';

export namespace GainProduction {
  export interface Options {
    count?: number;
    logMessage?: string;
    logBuilder?: (builder: LogBuilder) => void;
  }
}

export class GainProduction implements DeferredAction {
  public priority = Priority.GAIN_RESOURCE_OR_PRODUCTION;
  constructor(
    public player: Player,
    public resource: Resources,
    public options: GainProduction.Options = {},
  ) {}

  public execute() {
    if (this.options.count === undefined) {
      this.options.count = 1;
    } else {
      this.options.count = Math.abs(this.options.count);
    }
    this.player.addProduction(this.resource, this.options.count);
    if (this.options.logMessage !== undefined) {
      this.player.game.log(this.options.logMessage, this.options.logBuilder);
    }
    return undefined;
  }
}
