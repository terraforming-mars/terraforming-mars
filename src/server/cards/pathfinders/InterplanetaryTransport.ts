import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Tag} from '@/common/cards/Tag';
import {all} from '@/server/cards/Options';

export class InterplanetaryTransport extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.INTERPLANETARY_TRANSPORT,
      cost: 15,
      tags: [Tag.EARTH, Tag.JOVIAN, Tag.SPACE],
      victoryPoints: 1,

      behavior: {
        production: {megacredits: {cities: {where: 'offmars'}}},
      },

      metadata: {
        cardNumber: 'Pf43',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().city({all, secondaryTag: Tag.SPACE}).asterix;
        }),
        description: 'Increase your M€ production 1 step for every offworld city tile.',
      },
    });
  }
}

