import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class Aphrodite extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.APHRODITE,
      tags: [Tag.PLANT, Tag.VENUS],
      startingMegaCredits: 47,

      behavior: {
        production: {plants: 1},
      },

      metadata: {
        cardNumber: 'R01',
        description: 'You start with 1 plant production and 47 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.plants(1)).nbsp.megacredits(47);
          b.corpBox('effect', (ce) => {
            ce.effect('Whenever Venus is terraformed 1 step, you gain 2 M€.', (eb) => {
              eb.venus(1, {all}).startEffect.megacredits(2);
            });
          });
        }),
      },
    });
  }
}
