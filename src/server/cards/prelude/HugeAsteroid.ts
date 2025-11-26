import {IPlayer} from '@/server/IPlayer';
import {PreludeCard} from '@/server/cards/prelude/PreludeCard';
import {CardName} from '@/common/cards/CardName';
import {SelectPaymentDeferred} from '@/server/deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {PathfindersExpansion} from '@/server/pathfinders/PathfindersExpansion';

export class HugeAsteroid extends PreludeCard {
  constructor() {
    super({
      name: CardName.HUGE_ASTEROID,

      startingMegacredits: -5,

      behavior: {
        global: {temperature: 3},
      },

      metadata: {
        cardNumber: 'P15',
        renderData: CardRenderer.builder((b) => {
          b.temperature(3).br;
          b.megacredits(-5);
        }),
        description: 'Increase temperature 3 steps. Pay 5 M€.',
      },
    });
  }
  public override bespokeCanPlay(player: IPlayer) {
    return player.canAfford(5);
  }
  public override bespokePlay(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, -this.startingMegaCredits)).andThen(() => {
      PathfindersExpansion.addToSolBank(player);
    });
    return undefined;
  }
}
