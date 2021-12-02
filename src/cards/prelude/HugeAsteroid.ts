import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class HugeAsteroid extends PreludeCard {
  constructor() {
    super({
      name: CardName.HUGE_ASTEROID,

      startingMegacredits: -5,

      metadata: {
        cardNumber: 'P15',
        renderData: CardRenderer.builder((b) => {
          b.temperature(3).br;
          b.megacredits(-5);
        }),
        description: 'Increase Temperature 3 steps. Pay 5 M€.',
      },
    });
  }
  public canPlay(player: Player) {
    return player.canAfford(5);
  }
  public play(player: Player) {
    player.game.increaseTemperature(player, 3);
    player.game.defer(new SelectHowToPayDeferred(player, 5));
    return undefined;
  }
}
