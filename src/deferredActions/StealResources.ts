import {Player} from '../Player';
import {Resources} from '../Resources';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';

export class StealResources implements DeferredAction {
  public priority = Priority.ATTACK_OPPONENT;
  constructor(
        public player: Player,
        public resource: Resources,
        public count: number = 1,
        public title: string = 'Select player to steal up to ' + count + ' ' + resource + ' from',
  ) {}

  // Set this when you want to get a callback when the steal is completed.
  public stealComplete: () => void = () => {};

  public execute() {
    if (this.player.game.isSoloMode()) {
      this.player.addResource(this.resource, this.count);
      this.stealComplete();
      return undefined;
    }

    const candidates: Array<Player> = this.player.game.getPlayers()
      .filter((p) => p.id !== this.player.id && p.canRemoveResource(this.resource));

    if (candidates.length === 0) {
      return undefined;
    }

    const stealOptions = candidates.map((candidate) => {
      const qtyToSteal = Math.min(candidate.getResource(this.resource), this.count);
      return new SelectOption(
        'Steal ' + qtyToSteal + ' ' + this.resource + ' from ' + candidate.name,
        'Steal',
        () => {
          candidate.deductResource(this.resource, qtyToSteal, {log: true, from: this.player});
          this.player.addResource(this.resource, qtyToSteal);
          this.stealComplete();
          return undefined;
        },
      );
    });

    return new OrOptions(
      ...stealOptions,
      new SelectOption('Do not steal', 'Confirm', () => {
        return undefined;
      }),
    );
  }
}
