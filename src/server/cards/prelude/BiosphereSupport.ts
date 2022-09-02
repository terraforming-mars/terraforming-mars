import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class BiosphereSupport extends PreludeCard {
  constructor() {
    super({
      name: CardName.BIOSPHERE_SUPPORT,
      tags: [Tag.PLANT],

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
  public override canPlay(player: Player): boolean {
    return player.production.megacredits >= -4;
  }
  public play(player: Player) {
    player.production.add(Resources.MEGACREDITS, -1);
    player.production.add(Resources.PLANTS, 2);
    return undefined;
  }
}

