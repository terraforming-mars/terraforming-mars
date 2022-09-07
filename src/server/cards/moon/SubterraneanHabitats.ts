import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class SubterraneanHabitats extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SUBTERRANEAN_HABITATS,
      cardType: CardType.ACTIVE,
      cost: 12,
      reserveUnits: {steel: 2},
      tr: {moonColony: 1},

      behavior: {
        global: {moonColony: 1},
      },

      metadata: {
        description: 'Spend 2 steel. Raise the Colony Rate 1 step.',
        cardNumber: 'M36',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you build a colony on the Moon, you spend 1 titanium less.', (eb) => {
            eb.startEffect.moonColony().colon().minus().titanium(1);
          });
          b.br;
          b.minus().steel(2).moonColonyRate();
        }),
      },
    });
  }
}
