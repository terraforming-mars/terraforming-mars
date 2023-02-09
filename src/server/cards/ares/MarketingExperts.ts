import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';

export class MarketingExperts extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MARKETING_EXPERTS,
      tags: [Tag.EARTH],
      cost: 5,

      behavior: {
        production: {megacredits: 1},
      },

      metadata: {
        cardNumber: 'A12',
        renderData: CardRenderer.builder((b) => {
          b.effect('When an ADJACENCY BONUS is collected from a tile you own, you gain 1 M€.', (eb) => {
            eb.emptyTile().emptyTile('golden').startEffect.megacredits(1);
          }).br;
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Increase your M€ production 1 step.',
      },
    });
  }
}
