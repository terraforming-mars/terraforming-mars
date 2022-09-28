import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class FuelFactory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FUEL_FACTORY,
      tags: [Tag.BUILDING],
      cost: 6,

      behavior: {
        production: {energy: -1, megacredits: 1, titanium: 1},
      },

      metadata: {
        cardNumber: '180',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().titanium(1).megacredits(1);
          });
        }),
        description: 'Decrease your energy production 1 step and increase your titanium and your M€ production 1 step each.',
      },
    });
  }
}
