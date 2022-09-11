import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class AquiferTurbines extends PreludeCard {
  constructor() {
    super({
      name: CardName.AQUIFER_TURBINES,
      tags: [Tag.ENERGY],

      behavior: {
        production: {energy: 2},
        ocean: {},
      },

      startingMegacredits: -3,

      metadata: {
        cardNumber: 'P02',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).production((pb) => pb.energy(2)).br;
          b.megacredits(-3);
        }),
        description: 'Place an Ocean tile. Increase your energy production 2 steps. Pay 3 M€.',
      },
    });
  }
  public override bespokeCanPlay(player: Player) {
    return player.canAfford(3);
  }
  public override bespokePlay(player: Player) {
    player.game.defer(new SelectPaymentDeferred(player, 3));
    return undefined;
  }
}

