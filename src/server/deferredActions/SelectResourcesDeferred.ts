import {SelectResources} from '../inputs/SelectResources';
import {IPlayer} from '../IPlayer';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {Message} from '../../common/logs/Message';

export class SelectResourcesDeferred extends DeferredAction {
  constructor(
    player: IPlayer,
    public count: number,
    public title: string | Message,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    return new SelectResources(this.player, this.count, this.title);
  }
}
