import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class UndergroundDetonators extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.UNDERGROUND_DETONATORS,
      cardType: CardType.EVENT,
      cost: 9,

      behavior: {
        stock: {steel: 1, titanium: 1},
        moon: {miningRate: 1},
      },

      metadata: {
        description: 'Gain 1 steel and 1 titanium. Raise the Mining Rate 1 step.',
        cardNumber: 'M34',
        renderData: CardRenderer.builder((b) => {
          b.steel(1).titanium(1);
          b.br;
          b.moonMiningRate();
        }),
      },
    });
  }
}
