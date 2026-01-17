import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {all} from '@/server/cards/Options';

export class TollStation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.TOLL_STATION,
      tags: [Tag.SPACE],
      cost: 12,

      behavior: {
        production: {megacredits: {tag: Tag.SPACE, others: true}},
      },

      metadata: {
        cardNumber: '099',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().tag(Tag.SPACE, {all}).asterix();
          });
        }),
        description: 'Increase your M€ production 1 step for each space tag your OPPONENTS have.',
      },
    });
  }
}
