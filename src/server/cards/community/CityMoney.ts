
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class CityMoney extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CITY_MONEY,
      tags: [Tag.CITY],
      cost: 4,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: {tag: Tag.CITY}},
      },

      metadata: {
        cardNumber: 'M13',
        description: 'Increase your M€ production 1 step for each City tag you have, including this.',
        renderData: CardRenderer.builder((b) => b.production((pb) => {
          pb.megacredits(1).slash().tag(Tag.CITY);
        })),
      },
    });
  }
}
