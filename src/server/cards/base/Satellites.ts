import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class Satellites extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SATELLITES,
      tags: [Tag.SPACE],
      cost: 10,

      behavior: {
        production: {megacredits: {tag: Tag.SPACE}},
      },

      metadata: {
        cardNumber: '175',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().tag(Tag.SPACE);
          });
        }),
        description: 'Increase your M€ production 1 step for each space tag you have, including this one.',
      },
    });
  }
}
