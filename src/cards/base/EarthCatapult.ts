import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class EarthCatapult extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.EARTH_CATAPULT,
      tags: [Tags.EARTH],
      cost: 23,
      victoryPoints: 2,

      cardDiscount: {amount: 2},
      metadata: {
        cardNumber: '070',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a card, you pay 2 M€ less for it.', (eb) => {
            eb.empty().startEffect.megacredits(-2);
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }
}
