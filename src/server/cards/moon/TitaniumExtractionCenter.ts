import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class TitaniumExtractionCenter extends Card {
  constructor() {
    super({
      name: CardName.TITANIUM_EXTRACTION_CENTER,
      cardType: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      cost: 14,
      reserveUnits: {titanium: 2},

      behavior: {
        production: {titanium: {moon: {miningRate: {}}, per: 2}},
      },

      metadata: {
        description: 'Spend 2 titanium. Increase your titanium production 1 step for every 2 raised steps of Mining Rate.',
        cardNumber: 'M26',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).br;
          b.production((pb) => pb.titanium(1)).slash().moonMiningRate({amount: 2});
        }),
      },
    });
  }
}
