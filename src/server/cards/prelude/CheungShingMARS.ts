import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class CheungShingMARS extends CorporationCard {
  constructor() {
    super({
      name: CardName.CHEUNG_SHING_MARS,
      tags: [Tag.BUILDING],
      startingMegaCredits: 44,

      behavior: {
        production: {megacredits: 3},
      },

      cardDiscount: {tag: Tag.BUILDING, amount: 2},
      metadata: {
        cardNumber: 'R16',
        description: 'You start with 3 M€ production and 44 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.production((pb) => pb.megacredits(3)).nbsp.megacredits(44);
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a building tag, you pay 2 M€ less for it.', (eb) => {
              eb.building(1, {played}).startEffect.megacredits(-2);
            });
          });
        }),
      },
    });
  }
}
