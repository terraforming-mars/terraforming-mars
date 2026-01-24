import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class SubterraneanHabitats extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SUBTERRANEAN_HABITATS,
      type: CardType.ACTIVE,
      tags: [Tag.MOON],
      cost: 12,
      reserveUnits: {steel: 2},

      behavior: {
        moon: {habitatRate: 1},
      },

      metadata: {
        description: 'Spend 2 steel. Raise the habitat rate 1 step.',
        cardNumber: 'M36',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you build a habitat on THE MOON, you spend 1 titanium less.', (eb) => {
            eb.startEffect.moonHabitat().colon().minus().titanium(1);
          });
          b.br;
          b.minus().steel(2).moonHabitatRate();
        }),
      },
    });
  }
}
