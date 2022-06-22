import {SelectResources} from '../inputs/SelectResources';
import {Player} from '../Player';
import {DeferredAction, Priority} from './DeferredAction';

export class SelectResourcesDeferred extends DeferredAction {
  constructor(
    player: Player,
    public count: number,
    public title: string,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    return new SelectResources(this.player, this.count, this.title);
  }
}
