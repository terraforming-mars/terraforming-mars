import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class LunarTradeFleet extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_TRADE_FLEET,
      type: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.SPACE],
      cost: 8,

      behavior: {
        production: {megacredits: 1},
        moon: {logisticsRate: 1},
      },

      requirements: {production: Resource.TITANIUM, count: 2},
      metadata: {
        description: 'Requires that you have 2 titanium production. ' +
        'Increase your M€ production 1 step. Raise the logistic rate 1 step.',
        cardNumber: 'M35',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1));
          b.br;
          b.moonLogisticsRate();
        }),
      },
    });
  }
}
