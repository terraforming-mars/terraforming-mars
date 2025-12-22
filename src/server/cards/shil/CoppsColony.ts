import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class CoppsColony extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.COPPS_COLONY,
      tags: [Tag.MARS],
      cost: 17,
      victoryPoints: {tag: Tag.MARS},

      metadata: {
        cardNumber: 'SH006',
        description: 'The end of an era... 597 south mountain',
        renderData: CardRenderer.builder((b) => {
          b.vpText('1 VP per Mars tag you have.');
        }),
      },
    });
  }
}
