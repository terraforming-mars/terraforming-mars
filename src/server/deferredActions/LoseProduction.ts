import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';

export type Options = {
  count?: number;
}

export class LoseProduction extends DeferredAction {
  constructor(
    player: IPlayer,
    public resource: Resource,
    public options: Options = {},
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
    this.player.production.add(this.resource, -this.options.count);
    return undefined;
  }
}
