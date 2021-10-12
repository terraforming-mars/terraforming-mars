import {Player} from '../Player';
import {Resources} from '../Resources';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {DeferredAction, Priority} from './DeferredAction';

export class DecreaseAnyProduction implements DeferredAction {
  public priority = Priority.ATTACK_OPPONENT;
  constructor(
        public player: Player,
        public resource: Resources,
        public count: number = 1,
        public title: string = 'Select player to decrease ' + resource + ' production by ' + count + ' step(s)',
  ) {}

  public execute() {
    if (this.player.game.isSoloMode()) return undefined;

    const candidates = this.player.game.getPlayers().filter((p) => p.canRemoveProduction(this.resource));

    if (candidates.length === 0) {
      return undefined;
    }

    if (candidates.length === 1) {
      candidates[0].addProduction(this.resource, -this.count, {log: true, from: this.player});
      return undefined;
    }

    return new SelectPlayer(
      candidates,
      this.title,
      'Decrease',
      (found: Player) => {
        found.addProduction(this.resource, -this.count, {log: true, from: this.player});
        return undefined;
      },
    );
  }
}
