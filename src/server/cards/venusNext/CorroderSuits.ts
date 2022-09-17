import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class CorroderSuits extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CORRODER_SUITS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.VENUS],
      cost: 8,

      behavior: {
        production: {megacredits: 2},
        addResourcesToAnyCard: {count: 1, tag: Tag.VENUS},
      },

      metadata: {
        cardNumber: '219',
        description: 'Increase your M€ production 2 steps. Add 1 resource to ANY Venus CARD.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(2);
          }).wild(1, {secondaryTag: Tag.VENUS});
        }),
      },
    });
  }
}
