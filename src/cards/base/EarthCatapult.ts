import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class EarthCatapult extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.EARTH_CATAPULT,
      tags: [Tags.EARTH],
      cost: 23,

      metadata: {
        cardNumber: '070',
        renderData: CardRenderer.builder((b) => {
          b.effectBox((eb) => {
            eb.empty().startEffect.megacredits(-2);
            eb.description('Effect: When you play a card, you pay 2 MC less for it.');
          });
        }),
        victoryPoints: 2,
      },
    });
  }

  public getCardDiscount() {
    return 2;
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
