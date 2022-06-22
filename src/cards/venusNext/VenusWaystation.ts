import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';

export class VenusWaystation extends Card {
  constructor() {
    super({
      name: CardName.VENUS_WAYSTATION,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS, Tags.SPACE],
      cost: 9,
      victoryPoints: 1,

      cardDiscount: {tag: Tags.VENUS, amount: 2},
      metadata: {
        cardNumber: '258',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Venus tag, you pay 2 M€ less for it.', (eb)=> {
            eb.venus(1, {played}).startEffect.megacredits(-2);
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }
}
