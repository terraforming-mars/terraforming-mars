import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PowerOfFriendship extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.POWER_OF_FRIENDSHIP,
      tags: [Tag.EARTH, Tag.EARTH, Tag.BUILDING],
      cost: 24,
      requirements: {tag: Tag.EARTH, count: 4},

      behavior: {
        production: {megacredits: {tag: Tag.EARTH, per: 2}},
      },

      victoryPoints: {tag: Tag.EARTH, per: 2},

      metadata: {
        cardNumber: 'SH010',
        description: 'Cheers to the power of friendship',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).slash().tag(Tag.EARTH, 2));
          b.br;
          b.vpText('1 VP per 2 earth tags you have.');
        }),
      },
    });
  }
}

