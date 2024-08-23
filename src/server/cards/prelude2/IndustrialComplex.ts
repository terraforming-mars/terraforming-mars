import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {PreludeCard} from '../prelude/PreludeCard';
import {Units} from '../../../common/Units';

export class IndustrialComplex extends PreludeCard {
  constructor() {
    super({
      name: CardName.INDUSTRIAL_COMPLEX,
      tags: [Tag.BUILDING],

      startingMegacredits: -18,

      metadata: {
        cardNumber: 'P52',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(-18).production((pb) => pb.one(1)).asterix();
        }),
        description: 'Lose 18 M€. INCREASE ALL YOUR PRODUCTIONS THAT ARE LOWER THAN 1, TO 1.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    let megaCredits = -this.startingMegaCredits;
    if (player.isCorporation(CardName.MANUTECH)) {
      if (player.production.megacredits === 0) {
        megaCredits--;
      }
      if (player.canUseHeatAsMegaCredits) {
        if (player.production.heat === 0) {
          megaCredits--;
        }
      }
      if (player.canUseTitaniumAsMegacredits) {
        if (player.production.titanium === 0) {
          megaCredits -= player.getTitaniumValue() - 1;
        }
      }
    }

    return player.canAfford(megaCredits);
  }

  public override bespokePlay(player: IPlayer) {
    const production = {...Units.EMPTY};
    for (const key of Units.keys) {
      if (player.production[key] <= 0) {
        const diff = 1 - player.production[key];
        production[key] = Math.max(diff, 1);
      }
    }
    player.production.adjust(production, {log: true});

    player.game.defer(new SelectPaymentDeferred(player, 18));
    return undefined;
  }
}
