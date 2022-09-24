import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class RadChemFactory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RAD_CHEM_FACTORY,
      tags: [Tag.BUILDING],
      cost: 8,

      behavior: {
        production: {energy: -1},
        tr: 2,
      },

      metadata: {
        cardNumber: '205',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1)).br;
          b.tr(2);
        }),
        description: 'Decrease your energy production 1 step. Raise your TR 2 steps.',
      },
    });
  }
}
