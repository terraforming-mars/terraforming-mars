import {Player} from '../Player';
import {Resources} from '../common/Resources';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {DeferredAction, Priority} from './DeferredAction';

namespace DecreaseAnyProduction {
  export interface Options {
    count: number,
    stealing?: boolean
  }
}
export class DecreaseAnyProduction implements DeferredAction {
  public priority = Priority.ATTACK_OPPONENT;
  constructor(
    public player: Player,
    public resource: Resources,
    public options: DecreaseAnyProduction.Options = {
      count: 1,
      stealing: false,
    },
    public title: string = 'Select player to decrease ' + resource + ' production by ' + options.count + ' step(s)',
  ) { }

  public execute() {
    if (this.player.game.isSoloMode()) return undefined;

    let candidates: Array<Player> = this.player.game.getPlayersInGenerationOrder().filter((p) => !p.productionIsProtected());

    if (this.resource === Resources.MEGACREDITS) {
      candidates = candidates.filter((p) => p.getProduction(this.resource) >= this.options.count - 5);
    } else {
      candidates = candidates.filter((p) => p.getProduction(this.resource) >= this.options.count);
    }

    if (this.resource === Resources.STEEL || this.resource === Resources.TITANIUM) {
      candidates = candidates.filter((candidate) => !candidate.alloysAreProtected());
    }

    if (candidates.length === 0) {
      return undefined;
    }

    if (candidates.length === 1) {
      candidates[0].addProduction(this.resource, -this.options.count, {log: true, from: this.player, stealing: this.options.stealing});
      return undefined;
    }

    return new SelectPlayer(
      candidates,
      this.title,
      'Decrease',
      (found: Player) => {
        found.addProduction(this.resource, -this.options.count, {log: true, from: this.player, stealing: this.options.stealing});
        return undefined;
      },
    );
  }
}
