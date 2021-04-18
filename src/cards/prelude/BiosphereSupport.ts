import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class BiosphereSupport extends PreludeCard {
  constructor() {
    super({
      name: CardName.BIOSPHERE_SUPPORT,
      tags: [Tags.PLANT],

      metadata: {
        cardNumber: 'P05',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(1).br;
            pb.plants(2);
          });
        }),
        description: 'Increase your plant production 2 steps. Decrease your M€ production 1 step.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -4;
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -1);
    player.addProduction(Resources.PLANTS, 2);
    return undefined;
  }
}

