import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class IndustrialMicrobes extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INDUSTRIAL_MICROBES,
      tags: [Tag.MICROBE, Tag.BUILDING],
      cost: 12,

      behavior: {
        production: {energy: 1, steel: 1},
      },

      metadata: {
        cardNumber: '158',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).steel(1));
        }),
        description: 'Increase your energy production and your steel production 1 step each.',
      },
    });
  }
}

