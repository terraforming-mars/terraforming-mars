import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {Tag} from '@/common/cards/Tag';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class CorporateStronghold extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CORPORATE_STRONGHOLD,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 11,

      behavior: {
        production: {energy: -1, megacredits: 3},
        city: {},
      },
      victoryPoints: -2,

      metadata: {
        cardNumber: '182',
        description: 'Decrease your energy production 1 step and increase your M€ production 3 steps. Place a city tile.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.nbsp.city();
        }),
      },
    });
  }
}
