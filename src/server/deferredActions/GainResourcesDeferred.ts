import {GainResources} from '../inputs/GainResources';
import {IPlayer} from '../IPlayer';
import {DeferredAction} from './DeferredAction';
import {Message} from '../../common/logs/Message';

export class GainResourcesDeferred extends DeferredAction {
  constructor(
    player: IPlayer,
    public count: number,
    public title: string | Message,
  ) {
    super(player);
  }

  public execute() {
    return new GainResources(this.player, this.count, this.title);
  }
}
