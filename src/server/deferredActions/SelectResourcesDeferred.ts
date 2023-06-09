import {SelectResources} from '../inputs/SelectResources';
import {IPlayer} from '../IPlayer';
import {DeferredAction, Priority} from './DeferredAction';

export class SelectResourcesDeferred extends DeferredAction {
  constructor(
    player: IPlayer,
    public count: number,
    public title: string,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    return new SelectResources(this.player, this.count, this.title);
  }
}
