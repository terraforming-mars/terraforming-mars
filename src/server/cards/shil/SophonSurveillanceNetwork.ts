import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';

export class SophonSurveillanceNetwork extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SOPHON_SURVEILLANCE_NETWORK,
      tags: [Tag.SPACE, Tag.SCIENCE],
      cost: 8,
      victoryPoints: 2,

      requirements: {tag: Tag.SCIENCE, count: 2},
      metadata: {
        description: 'Requires 2 science tags.',
        cardNumber: 'SH001',
      },
    });
  }
}

