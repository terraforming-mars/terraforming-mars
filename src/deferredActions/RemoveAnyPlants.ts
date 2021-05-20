import {Player} from '../Player';
import {Resources} from '../Resources';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';

export class RemoveAnyPlants implements DeferredAction {
  public priority = Priority.ATTACK_OPPONENT;
  constructor(
        public player: Player,
        public count: number = 1,
        public title: string = 'Select player to remove up to ' + count + ' plants',
  ) {}

  public execute() {
    if (this.player.game.isSoloMode()) {
      // Crash site cleanup hook
      this.player.game.someoneHasRemovedOtherPlayersPlants = true;
      return undefined;
    }

    const candidates = this.player.game.getPlayers().filter((p) => p.id !== this.player.id && !p.plantsAreProtected() && p.plants > 0);

    if (candidates.length === 0) {
      return undefined;
    }

    const removalOptions = candidates.map((candidate) => {
      const qtyToRemove = Math.min(candidate.plants, this.count);
      return new SelectOption('Remove ' + qtyToRemove + ' plants from ' + candidate.name, 'Remove plants', () => {
        candidate.deductResource(Resources.PLANTS, qtyToRemove, {log: true, from: this.player});
        return undefined;
      });
    });

    return new OrOptions(
      ...removalOptions,
      new SelectOption('Skip removing plants', 'Confirm', () => {
        return undefined;
      }),
    );
  }
}
