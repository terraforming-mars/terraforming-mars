import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';

export class PhoboLog extends CorporationCard {
  constructor() {
    super({
      name: CardName.PHOBOLOG,
      tags: [Tag.SPACE],
      startingMegaCredits: 23,

      behavior: {
        stock: {titanium: 10},
        titanumValue: 1,
      },

      metadata: {
        cardNumber: 'R09',
        description: 'You start with 10 titanium and 23 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(23).nbsp.titanium(10, {digit});
          b.corpBox('effect', (ce) => {
            ce.effect('Your titanium resources are each worth 1 M€ extra.', (eb) => {
              eb.titanium(1).startEffect.plus(Size.SMALL).megacredits(1);
            });
          });
        }),
      },
    });
  }
}
