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
              stock: {steel: 5},
              title: 'Spend 1 corruption to gain 5 steel.',
            },
            {
              spend: {corruption: 1},
              stock: {titanium: 3},
              title: 'Spend 1 corruption to gain 3 titanium.',
            },
            {
              spend: {corruption: 1},
              stock: {plants: 4},
              title: 'Spend 1 corruption to gain 4 plants.',
            },
            {
              spend: {corruption: 1},
              stock: {heat: 8},
              title: 'Spend 1 corruption to gain 8 heat.',
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
            .steel(5, {digit}).or()
            .titanium(3, {digit}).br;
          b.or()
            .plants(4, {digit}).or()
            .heat(8, {digit}).br;
          b.plainText('(Action: Pay 1 corruption to gain either 5 steel, 3 titanium, 4 plants or 8 heat.)').br;
        }),
      },
    });
  }
}
