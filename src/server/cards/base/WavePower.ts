import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class WavePower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.WAVE_POWER,
      tags: [Tag.ENERGY],
      cost: 8,
      victoryPoints: 1,

      behavior: {
        production: {energy: 1},
      },

      requirements: CardRequirements.builder((b) => b.oceans(3)),
      metadata: {
        cardNumber: '139',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1));
        }),
        description: 'Requires 3 ocean tiles. Increase your energy production 1 step.',
      },
    });
  }
}

