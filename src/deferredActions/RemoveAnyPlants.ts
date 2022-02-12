import {Player} from '../Player';
import {Resources} from '../common/Resources';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';
import {CardName} from '../common/cards/CardName';

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

    const candidates = this.player.game.getPlayersInGenerationOrder().filter((p) => p.id !== this.player.id && !p.plantsAreProtected() && p.plants > 0);

    if (candidates.length === 0) {
      return undefined;
    }

    const removalOptions = candidates.map((candidate) => {
      let qtyToRemove = Math.min(candidate.plants, this.count);

      // Botanical Experience hook.
      if (candidate.cardIsInEffect(CardName.BOTANICAL_EXPERIENCE)) {
        qtyToRemove = Math.ceil(qtyToRemove / 2);
      }

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
