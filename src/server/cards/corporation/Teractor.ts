import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Teractor extends CorporationCard {
  constructor() {
    super({
      name: CardName.TERACTOR,
      tags: [Tag.EARTH],
      startingMegaCredits: 60,

      cardDiscount: {tag: Tag.EARTH, amount: 3},
      metadata: {
        cardNumber: 'R30',
        description: 'You start with 60 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(60);
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an Earth tag, you pay 3 M€ less for it.', (eb) => {
              eb.tag(Tag.EARTH).startEffect.megacredits(-3);
            });
          });
        }),
      },
    });
  }
}
