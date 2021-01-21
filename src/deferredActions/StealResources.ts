import {Player} from '../Player';
import {Resources} from '../Resources';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction} from './DeferredAction';

export class StealResources implements DeferredAction {
  constructor(
        public player: Player,
        public resource: Resources,
        public count: number = 1,
        public title: string = 'Select player to steal up to ' + count + ' ' + resource + ' from',
  ) {}

  public execute() {
    if (this.player.game.isSoloMode()) {
      this.player.setResource(this.resource, this.count);
      return undefined;
    }

    let candidates: Array<Player> = [];
    if (this.resource === Resources.PLANTS) {
      candidates = this.player.game.getPlayers().filter((p) => p.id !== this.player.id && p.getResource(this.resource) > 0 && !p.plantsAreProtected());
    } else {
      candidates = this.player.game.getPlayers().filter((p) => p.id !== this.player.id && p.getResource(this.resource) > 0);
    }

    if (candidates.length === 0) {
      return undefined;
    }

    const stealOptions = candidates.map((candidate) => {
      const qtyToSteal = Math.min(candidate.getResource(this.resource), this.count);
      return new SelectOption(
        'Steal ' + qtyToSteal + ' ' + this.resource + ' from ' + candidate.name,
        'Steal',
        () => {
          candidate.setResource(this.resource, -qtyToSteal, this.player.game, this.player);
          this.player.setResource(this.resource, qtyToSteal);
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
