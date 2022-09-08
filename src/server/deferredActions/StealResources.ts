import {Player} from '../Player';
import {Resources} from '../../common/Resources';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';
import {CardName} from '../../common/cards/CardName';

export class StealResources extends DeferredAction {
  constructor(
    player: Player,
    public resource: Resources,
    public count: number = 1,
    public title: string = 'Select player to steal up to ' + count + ' ' + resource + ' from',
  ) {
    super(player, Priority.ATTACK_OPPONENT);
  }

  // Set this when you want to get a callback when the steal is completed.
  public stealComplete: () => void = () => {};

  public execute() {
    if (this.player.game.isSoloMode()) {
      this.player.addResource(this.resource, this.count);
      this.player.resolveInsuranceInSoloGame();
      this.stealComplete();
      return undefined;
    }

    let candidates: Array<Player> = this.player.game.getPlayers().filter((p) => p.id !== this.player.id && p.getResource(this.resource) > 0);
    if (this.resource === Resources.PLANTS) {
      candidates = candidates.filter((p) => !p.plantsAreProtected());
    }
    if (this.resource === Resources.STEEL || this.resource === Resources.TITANIUM) {
      candidates = candidates.filter((p) => !p.alloysAreProtected());
    }

    if (candidates.length === 0) {
      return undefined;
    }

    const stealOptions = candidates.map((candidate) => {
      let qtyToSteal = Math.min(candidate.getResource(this.resource), this.count);

      // Botanical Experience hook.
      if (this.resource === Resources.PLANTS && candidate.cardIsInEffect(CardName.BOTANICAL_EXPERIENCE)) {
        qtyToSteal = Math.ceil(qtyToSteal / 2);
      }

      return new SelectOption(
        'Steal ' + qtyToSteal + ' ' + this.resource + ' from ' + candidate.name,
        'Steal',
        () => {
          candidate.deductResource(this.resource, qtyToSteal, {log: true, from: this.player, stealing: true});
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
