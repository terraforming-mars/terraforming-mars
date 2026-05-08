import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';

export class FuturisticCentre extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.FUTURISTIC_CENTRE,
      tags: [Tag.SCIENCE],
      cost: 18,
      victoryPoints: 1,

      // Applies to all card purchases (closest approximation to research-phase discount)
      cardDiscount: {amount: 1},

      metadata: {
        cardNumber: 'B01',
        description: 'Effect: During the research phase you pay 1 M€ less for cards you buy.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you buy a card, pay 1 M€ less for it.', (eb) => {
            eb.cards(1).startEffect.megacredits(-1);
          });
        }),
      },
    });
  }
}
