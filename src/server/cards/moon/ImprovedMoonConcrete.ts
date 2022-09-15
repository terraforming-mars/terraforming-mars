import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class ImprovedMoonConcrete extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.IMPROVED_MOON_CONCRETE,
      cardType: CardType.ACTIVE,
      cost: 12,
      reserveUnits: {steel: 2},

      behavior: {
        moon: {miningRate: 1},
      },

      metadata: {
        description: 'Spend 2 steel. Raise the Mining Rate 1 step.',
        cardNumber: 'M37',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you build a mine on The Moon, you spend 1 titanium less.', (eb) => {
            eb.moonMine().startEffect.minus().titanium(1);
          }).br;
          b.minus().steel(2).moonMiningRate();
        }),
      },
    });
  }
}
