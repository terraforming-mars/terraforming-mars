import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';
import {ICorporationCard} from './ICorporationCard';

export class PhoboLog extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.PHOBOLOG,
      tags: [Tag.SPACE],
      startingMegaCredits: 23,

      behavior: {
        stock: {titanium: 8},
        titanumValue: 1,
      },

      metadata: {
        cardNumber: 'R09',
        description: 'You start with 8 titanium and 30 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(30).nbsp.titanium(8, {digit});
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
