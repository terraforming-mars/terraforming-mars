import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {Card} from '../Card';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardType} from '../../../common/cards/CardType';

export class SummitLogistics extends Card {
  constructor() {
    super({
      name: CardName.SUMMIT_LOGISTICS,
      type: CardType.AUTOMATED,
      tags: [Tag.BUILDING, Tag.SPACE],
      cost: 10,

      requirements: {party: PartyName.SCIENTISTS},

      behavior: {
        stock: {
          megacredits: {
            tag: [Tag.JOVIAN, Tag.EARTH, Tag.VENUS, Tag.MARS],
            colonies: {colonies: {}},
          },
        },
        drawCard: 2,
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().jovian({played}).earth(1, {played}).venus(1, {played}).colonies(1);
          b.br;
          b.cards(2).br;
          b.plainText('(Requires that Scientists are ruling or that you have 2 delegates there. ' +
            'Gain 1 M€ per planet tag and colony you have. Draw 2 cards.)');
          b.br;
          b.plainText('(FAN EXPANSION NOTE: This includes Mars but not The Moon.)');
        }),
      },
    });
  }
}
