import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit} from '../Options';

export class SolarReflectors extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 23,
      tags: [Tag.SPACE],
      name: CardName.SOLAR_REFLECTORS,
      cardType: CardType.AUTOMATED,

      behavior: {
        production: {heat: 5},
      },

      metadata: {
        cardNumber: 'C38',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(5, {digit}));
        }),
        description: 'Increase your heat production 5 steps.',
      },
    });
  }
}
