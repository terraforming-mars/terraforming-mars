import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Thorgate extends CorporationCard {
  constructor() {
    super({
      name: CardName.THORGATE,
      tags: [Tag.POWER],
      startingMegaCredits: 48,

      behavior: {
        production: {energy: 1},
      },

      cardDiscount: {tag: Tag.POWER, amount: 3},
      metadata: {
        cardNumber: 'R13',
        description: 'You start with 1 energy production and 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.energy(1)).nbsp.megacredits(48);
          b.corpBox('effect', (ce) => {
            ce.effect('When playing a power card OR THE STANDARD PROJECT POWER PLANT, you pay 3 M€ less for it.', (eb) => {
              eb.energy(1, {played}).asterix().startEffect.megacredits(-3);
            });
          });
        }),
      },
    });
  }
}

