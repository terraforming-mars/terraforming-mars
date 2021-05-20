import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AlliedBanks extends PreludeCard {
  constructor() {
    super({
      name: CardName.ALLIED_BANKS,
      tags: [Tags.EARTH],

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
    player.addProduction(Resources.MEGACREDITS, 4);
    player.megaCredits += 3;
    return undefined;
  }
}

