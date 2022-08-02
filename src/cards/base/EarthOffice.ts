import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class EarthOffice extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.EARTH_OFFICE,
      tags: [Tags.EARTH],
      cost: 1,

      cardDiscount: {tag: Tags.EARTH, amount: 3},
      metadata: {
        cardNumber: '105',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play an Earth tag, you pay 3 M€ less for it.', (eb) => {
            eb.earth(1, {played}).startEffect.megacredits(-3);
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }
}
