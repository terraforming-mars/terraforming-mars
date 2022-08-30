import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Biofuels extends PreludeCard {
  constructor() {
    super({
      name: CardName.BIOFUELS,
      tags: [Tag.MICROBE],
      productionBox: {energy: 1, plants: 1},

      metadata: {
        cardNumber: 'P03',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).plants(1)).br;
          b.plants(2);
        }),
        description: 'Increase your energy and plant production 1 step. Gain 2 plants.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.plants += 2;
    return undefined;
  }
}

