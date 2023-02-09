import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class IronExtractionCenter extends Card {
  constructor() {
    super({
      name: CardName.IRON_EXTRACTION_CENTER,
      cardType: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      cost: 10,
      reserveUnits: {titanium: 1},

      behavior: {
        production: {steel: {moon: {miningRate: {}}, per: 2}},
      },

      metadata: {
        description: 'Spend 1 titanium. Increase your steel production 1 step for every 2 raised steps of mining rate.',
        cardNumber: 'M25',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.production((pb) => pb.steel(1)).slash().moonMiningRate({amount: 2});
        }),
      },
    });
  }
}
