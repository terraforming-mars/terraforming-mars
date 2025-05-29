import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {ActiveCorporationCard} from '../corporation/CorporationCard';

export class JensonBoyleCo extends ActiveCorporationCard {
  constructor() {
    super({
      name: CardName.JENSON_BOYLE_CO,
      tags: [Tag.CRIME],
      startingMegaCredits: 46,

      behavior: {
        underworld: {corruption: 2},
      },

      action: {
        or: {
          behaviors: [
            {
              spend: {corruption: 1},
              stock: {steel: 4},
              title: 'Spend 1 corruption to gain 4 steel.',
            },
            {
              spend: {corruption: 1},
              stock: {titanium: 3},
              title: 'Spend 1 corruption to gain 3 titanium.',
            },
            {
              spend: {corruption: 1},
              stock: {plants: 3},
              title: 'Spend 1 corruption to gain 3 plants.',
            },
            {
              spend: {corruption: 1},
              stock: {heat: 6},
              title: 'Spend 1 corruption to gain 6 heat.',
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'UC03',
        description: 'You start with 46 M€ and 2 corruption.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(46).corruption(2).br.br;
          b.corruption(1).arrow()
            .steel(4, {digit}).or()
            .titanium(3, {digit}).br;
          b.or()
            .plants(3, {digit}).or()
            .heat(6, {digit}).br;
          b.plainText('(Action: Pay 1 corruption to gain either 4 steel, 3 titanium, 3 plants or 6 heat.)').br;
        }),
      },
    });
  }
}
