import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card2} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';

export class TransNeptuneProbe extends Card2 implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TRANS_NEPTUNE_PROBE,
      tags: [Tag.SCIENCE, Tag.SPACE],
      cost: 6,
      victoryPoints: 1,

      metadata: {
        cardNumber: '084',
      },
    });
  }
}
