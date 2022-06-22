import {Player} from '../Player';
import {Resources} from '../common/Resources';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {DeferredAction, Priority} from './DeferredAction';
import {MonsInsurance} from '../cards/promo/MonsInsurance';

namespace DecreaseAnyProduction {
  export interface Options {
    count: number,
    stealing?: boolean
  }
}
export class DecreaseAnyProduction extends DeferredAction {
  constructor(
    player: Player,
    public resource: Resources,
    public options: DecreaseAnyProduction.Options = {
      count: 1,
      stealing: false,
    },
    public title: string = 'Select player to decrease ' + resource + ' production by ' + options.count + ' step(s)',
  ) {
    super(player, Priority.ATTACK_OPPONENT);
  }

  public execute() {
    if (this.player.game.isSoloMode()) {
      MonsInsurance.resolveInsuranceInSoloGame(this.player);
      return undefined;
    }

    const candidates: Array<Player> = this.player.game.getPlayers().filter((p) => p.canHaveProductionReduced(this.resource, this.options.count, this.player));

    if (candidates.length === 0) {
      return undefined;
    }

    if (candidates.length === 1 && candidates[0] !== this.player) {
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
