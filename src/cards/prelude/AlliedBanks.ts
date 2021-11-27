import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class AlliedBanks extends PreludeCard {
  constructor() {
    super({
      name: CardName.ALLIED_BANKS,
      tags: [Tags.EARTH],

      productionBox: Units.of({megacredits: 4}),
      startingMegacredits: 3,

      metadata: {
        cardNumber: 'P01',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(4)).br;
          b.megacredits(3);
        }),
        description: 'Increase your M€ production 4 steps. Gain 3 M€.',
      },
    });
  }
  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    player.megaCredits += this.startingMegaCredits;
    return undefined;
  }
}

