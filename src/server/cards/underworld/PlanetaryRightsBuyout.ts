import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class PlanetaryRightsBuyout extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PLANETARY_RIGHTS_BUYOUT,
      type: CardType.EVENT,
      cost: 28,

      requirements: {corruption: 5},
      behavior: {tr: 7},
      victoryPoints: -3,

      metadata: {
        cardNumber: 'U85',
        renderData: CardRenderer.builder((b) => {
          b.tr(7);
        }),
        description: 'Requires 5 corruption. Gain 7 TR',
      },
    });
  }
}
