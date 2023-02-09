import {ICorporationCard} from './ICorporationCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class BeginnerCorporation extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.BEGINNER_CORPORATION,

      behavior: {
        drawCard: 10,
      },

      metadata: {
        cardNumber: 'R00',
        description: 'You start with 42 M€. Instead of choosing from 10 cards during setup, you get 10 cards for free.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).nbsp.cards(10, {digit});
        }),
      },
      startingMegaCredits: 42,
    });
  }
}
