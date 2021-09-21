import {SelectResources} from '../inputs/SelectResources';
import {Player} from '../Player';
import {DeferredAction, Priority} from './DeferredAction';

export class SelectResourcesDeferred implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player,
        public count: number,
        public title: string,
  ) {}

  public execute() {
    return new SelectResources(this.player, this.count, this.title);
  }
}
